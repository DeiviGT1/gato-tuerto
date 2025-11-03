// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
  email: String,
  paymentMethod: String,
  cardNumber: String,
  zipCode: String,
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number,
      size: String,
    },
  ],
  total: Number,
  subTotal: Number,
  salesTax: Number,
  tipPercentage: Number,
  status: { type: String, default: 'pending' },
  notes: String,
}, { timestamps: true }); // <--- Activar timestamps

module.exports = mongoose.model('Order', orderSchema);