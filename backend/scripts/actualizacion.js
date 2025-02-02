// backend/scripts/actualizacion.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const { connectDB } = require('../config/database'); // Usar la misma conexión

(async () => {
  try {
    await connectDB();

    // Leer JSON
    const filePath = path.join(__dirname, 'inventory.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
    mongoose.connection.close();
    console.log('Inventory and prices successfully updated.');
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
})();