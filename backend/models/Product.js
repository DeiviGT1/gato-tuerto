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
      img: String,
      inventory: Number,
      size_ml: Number,
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);