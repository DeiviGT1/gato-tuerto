// backend/actualizacion.js

const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Importa el modelo sin redefinir

require('dotenv').config(); // Cargar variables de entorno

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'el-gato-tuerto' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

async function updateInventoryAndPrice() {
  try {
    // Leer y parsear el archivo JSON
    const data = JSON.parse(fs.readFileSync('inventory.json', 'utf8')); // Ajusta la ruta si es necesario

    // Crear un mapa de IDs de tamaño a precio e inventario actualizados para una búsqueda rápida
    const updatedSizesMap = new Map();

    for (const product of data) {
      if (product.sizes && Array.isArray(product.sizes)) {
        for (const size of product.sizes) {
          updatedSizesMap.set(size.id, {
            price: size.price,
            inventory: size.inventory
          });
        }
      }
    }

    // Obtener todos los productos de la base de datos
    const products = await Product.find();

    // Preparar operaciones en lote
    const bulkOps = [];

    for (const product of products) {
      let sizesUpdated = false;

      // Iterar sobre los tamaños
      for (let i = 0; i < product.sizes.length; i++) {
        const size = product.sizes[i];
        const sizeId = size.id;

        const updatedSizeData = updatedSizesMap.get(sizeId);

        if (updatedSizeData) {
          // Actualizar precio e inventario desde los datos actualizados
          product.sizes[i].price = updatedSizeData.price;
          product.sizes[i].inventory = updatedSizeData.inventory;
        } else {
          // Establecer precio a 100000 e inventario a 0 si no se encuentra
          product.sizes[i].price = 100000;
          product.sizes[i].inventory = 0;
        }
        sizesUpdated = true;
      }

      if (sizesUpdated) {
        // Preparar una operación de actualización para este producto
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: {
              $set: {
                'sizes': product.sizes
              }
            }
          }
        });
      }
    }

    // Ejecutar operaciones en lote si hay alguna
    if (bulkOps.length > 0) {
      const result = await Product.bulkWrite(bulkOps);
      console.log('Bulk operation result:', result);
    } else {
      console.log('No products to update.');
    }

    console.log('Inventory and prices successfully updated.');
  } catch (error) {
    console.error('Error updating inventory and prices:', error);
  } finally {
    mongoose.connection.close(); // Cerrar la conexión después de la operación
  }
}

updateInventoryAndPrice();