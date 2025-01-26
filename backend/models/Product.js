// backend/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    alcoholicBeverage: String,
    type: String,
    subtype: String,
    brand: String,
    name: String,
    description: String,
    route: String,
    modal: Boolean,
    sizes: [
      {
        id: String,
        size: String,
        price: Number,
        img: String, // URL de la imagen
        inventory: Number,
        size_ml: Number,
      },
    ],
  });
  
const Product = mongoose.model('Product', productSchema);

module.exports = Product;