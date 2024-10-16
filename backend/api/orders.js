// api/orders.js

const mongoose = require('mongoose');
const Order = require('../models/Order'); // Asegúrate de tener el modelo Order separado
require('dotenv').config();

// Conexión a MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ message: 'Only GET requests allowed' });
  }

  try {
    const auth = req.cookies.auth;

    // Verifica la autenticación aquí
    if (!auth) {
      return res.status(401).send('Autenticación requerida');
    }

    const orders = await Order.find({ status: 'pending' });
    const completedOrders = await Order.find({ status: 'completed' });

    // Genera el HTML aquí o considera devolver JSON y manejar el frontend por separado
    res.status(200).send('HTML de pedidos'); // Reemplaza esto con tu lógica de generación de HTML
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};