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
    <head>
      <title>Actualizar Inventario</title>
      <style>
        /* Tus estilos para la página aquí */
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 2em;
          text-align: center;
          margin-bottom: 20px;
          color: #475169;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        input[type="file"] {
          margin-bottom: 20px;
        }
        button {
          background-color: #475169;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
        }
        button:hover {
          background-color: #333;
        }
        .loading {
          display: none;
          font-size: 1.2em;
          color: #475169;
          margin-top: 20px;
        }
        .message {
          display: none;
          font-size: 1.2em;
          margin-top: 20px;
        }
        .success {
          color: green;
        }
        .error {
          color: red;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Actualizar Inventario</h1>
        <form id="uploadForm">
          <input type="file" name="inventoryFile" accept=".txt" required>
          <button type="submit">Actualizar</button>
        </form>
        <div class="loading" id="loading">Cargando...</div>
        <div class="message" id="message"></div>
      </div>
      <script>
        document.getElementById('uploadForm').addEventListener('submit', async function(event) {
          event.preventDefault();

          const formData = new FormData(this);
          const loadingElement = document.getElementById('loading');
          const messageElement = document.getElementById('message');

          // Mostrar indicador de carga
          loadingElement.style.display = 'block';
          messageElement.style.display = 'none';

          try {
            const response = await fetch('/update-inventory', {
              method: 'POST',
              body: formData
            });

            const result = await response.json();
            loadingElement.style.display = 'none';

            if (response.ok && result.success) {
              messageElement.textContent = result.message;
              messageElement.classList.remove('error');
              messageElement.classList.add('success');
            } else {
              throw new Error(result.error || 'Error al actualizar el inventario');
            }
          } catch (error) {
            loadingElement.style.display = 'none';
            messageElement.textContent = error.message;
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
          } finally {
            messageElement.style.display = 'block';
          }
        });
      </script>
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