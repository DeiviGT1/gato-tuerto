// backend/controllers/inventoryController.js
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const stream = require('stream');
const Product = require('../models/Product');

// Página simple para subir el archivo
exports.getUpdateInventoryPage = (req, res) => {
  // Copia el HTML de tu "/update-inventory-page"
  // y haz un res.send(html).
  const html = `
    <!DOCTYPE html>
    <html>
      <head> <title>Actualizar Inventario</title> </head>
      <body>
        <!-- Coloca aquí tu formulario y tu JS inline o usa un motor de plantillas -->
        <h1>Actualizar Inventario</h1>
        ...
      </body>
    </html>
  `;
  res.send(html);
};

// Lógica para procesar el archivo subido
exports.updateInventory = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Received a file upload request.`);

  if (!req.file) {
    console.log(`[${new Date().toISOString()}] No file uploaded.`);
    return res
      .status(400)
      .send({ success: false, error: 'No se ha cargado ningún archivo.' });
  }

  const expectedHeaders = [
    'BARCODE',
    'BRAND',
    'DESCRIP',
    'TYPE',
    'SIZE',
    'PRICE_C',
    'QTY_ON_HND',
  ];
  const fileContent = req.file.buffer.toString('utf-8');

  const parseCsvContent = (content, separator) => {
    return new Promise((resolve, reject) => {
      const inventory = [];
      let headersValid = false;

      const parser = csv({ separator: separator })
        .on('headers', (headers) => {
          headersValid = expectedHeaders.every(
            (header, index) => header === headers[index]
          );
          if (!headersValid) {
            parser.emit('error', new Error('Invalid headers'));
          }
        })
        .on('data', (row) => {
          row.QTY_ON_HND = row.QTY_ON_HND || 0;
          row.PRICE_C = row.PRICE_C || 0;
          inventory.push(row);
        })
        .on('end', () => {
          if (headersValid) {
            resolve(inventory);
          } else {
            reject(new Error('Headers do not match expected format'));
          }
        })
        .on('error', (err) => {
          reject(err);
        });

      const contentStream = new stream.Readable();
      contentStream.push(content);
      contentStream.push(null);
      contentStream.pipe(parser);
    });
  };

  try {
    let inventory = [];
    let separatorUsed = '';

    try {
      // Primero intenta con tabulador
      inventory = await parseCsvContent(fileContent, '\t');
      separatorUsed = 'tab';
    } catch (err) {
      console.log(`Fallo con separador tab: ${err.message}`);
      // Si falla, intenta con coma
      inventory = await parseCsvContent(fileContent, ',');
      separatorUsed = 'comma';
    }

    // Crear un mapa para búsqueda rápida
    const inventoryMap = new Map();
    inventory.forEach((item) => {
      inventoryMap.set(item.BARCODE, {
        QTY_ON_HND: parseInt(item.QTY_ON_HND, 10) || 0,
        PRICE_C: parseFloat(item.PRICE_C) || 0,
      });
    });

    // Obtener productos de la BD
    const products = await Product.find().lean();
    const bulkOps = [];

    products.forEach((product) => {
      let sizesUpdated = false;

      product.sizes.forEach((size) => {
        const inventoryData = inventoryMap.get(size.id);
        if (inventoryData) {
          size.price = inventoryData.PRICE_C;
          size.inventory = inventoryData.QTY_ON_HND;
        } else {
          size.price = 100000;
          size.inventory = 0;
        }
        sizesUpdated = true;
      });

      if (sizesUpdated) {
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { sizes: product.sizes } },
          },
        });
      }
    });

    if (bulkOps.length > 0) {
      const result = await Product.bulkWrite(bulkOps);
      console.log(`[${new Date().toISOString()}] Bulk operation result:`, result);
    } else {
      console.log('No products to update.');
    }

    return res.send({
      success: true,
      message: 'Inventario actualizado correctamente.',
    });
  } catch (err) {
    console.error(`Error processing the CSV file:`, err.message);

    res.status(400).json({
      success: false,
      error:
        err.message ||
        'An unexpected error occurred while processing the inventory update.',
    });
  }
};