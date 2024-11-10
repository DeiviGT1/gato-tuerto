// actualizacion.js

const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path as necessary

require('dotenv').config(); // Load environment variables

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'el-gato-tuerto' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

async function updateInventoryAndPrice() {
  try {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync('inventory.json', 'utf8')); // Adjust the file path if necessary

    // Create a map from size IDs to updated price and inventory for quick lookup
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

    // Fetch all products from the database
    const products = await Product.find();

    // Prepare bulk write operations
    const bulkOps = [];

    for (const product of products) {
      let sizesUpdated = false;

      // Iterate over sizes
      for (let i = 0; i < product.sizes.length; i++) {
        const size = product.sizes[i];
        const sizeId = size.id;

        const updatedSizeData = updatedSizesMap.get(sizeId);

        if (updatedSizeData) {
          // Update price and inventory from updated data
          product.sizes[i].price = updatedSizeData.price;
          product.sizes[i].inventory = updatedSizeData.inventory;
        } else {
          // Set price to 100000 and inventory to 0 if not found
          product.sizes[i].price = 100000;
          product.sizes[i].inventory = 0;
        }
        sizesUpdated = true;
      }

      if (sizesUpdated) {
        // Prepare an update operation for this product
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

    // Execute bulk operations if there are any
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
    mongoose.connection.close(); // Close the connection after operation
  }
}

updateInventoryAndPrice();