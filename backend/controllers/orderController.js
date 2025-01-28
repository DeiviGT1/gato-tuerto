// backend/controllers/orderController.js

const axios = require('axios');
const Order = require('../models/Order');

// Lee las variables de entorno para Telegram
// Ahora TELEGRAM_CHAT_ID es un array
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID,
  process.env.TELEGRAM_CHAT_ID_2
];

// Controlador para crear un nuevo pedido (checkout)
exports.createOrder = async (req, res) => {
  try {
    const {
      name,
      address,
      phoneNumber,
      email,
      paymentMethod,
      cardNumber,
      items,
      total,
      notes,
    } = req.body;

    // Validación básica
    if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
      return res
        .status(400)
        .send({ success: false, error: 'Missing required fields' });
    }

    // Guarda el pedido en la base de datos
    const newOrder = new Order({
      name,
      address,
      phoneNumber,
      email,
      paymentMethod,
      cardNumber,
      items,
      total,
      notes,
    });

    const order = await newOrder.save();

    // Detalles del pedido (para enviar por Telegram)
    const orderDetails = `
      *Nuevo Pedido Recibido*:
      *Nombre:* ${name}
      *Dirección:* ${address}
      *Teléfono:* ${phoneNumber}
      *Email:* ${email}
      *Método de pago:* ${paymentMethod}
      ${
        paymentMethod === 'card'
          ? `*Últimos 4 dígitos de tarjeta:* ${cardNumber}`
          : ''
      }
      *Total:* $${total.toFixed(2)}
      *Notas:* ${notes || 'No hay notas'}
      
      *Items:*
      ${items
        .map((item) => `• ${item.name} - ${item.size} x ${item.quantity}`)
        .join('\n')}
    `;

    // Envía el mensaje a cada uno de los chat IDs
    // Usamos un Promise.all para hacer todas las llamadas en paralelo
    await Promise.all(
      TELEGRAM_CHAT_IDS.map((chatId) =>
        axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: orderDetails,
          parse_mode: 'Markdown',
        })
      )
    );

    // Respuesta al frontend
    res.status(200).send({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para completar un pedido
exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.body;

    await Order.findByIdAndUpdate(id, { status: 'completed' });
    res.send({ success: true });
  } catch (error) {
    console.error('Error al completar el pedido:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para cancelar un pedido
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'canceled' },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).send({ success: false, message: 'Pedido no encontrado' });
    }
    res.send({ success: true });
  } catch (error) {
    console.error('Error al cancelar el pedido:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para mostrar pedidos y renderizar la página HTML de administración
exports.getOrdersPage = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: 'pending' });
    const completedOrders = await Order.find({ status: 'completed' });
    const canceledOrders = await Order.find({ status: 'canceled' });

    // Tu lógica de renderización HTML
    let html = `
    `;

    res.send(html);
  } catch (error) {
    console.error('Error obteniendo página de pedidos:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

// Controlador para obtener todos los pedidos en JSON (API)
exports.getAllOrdersJson = async (req, res) => {
  try {
    const pending = await Order.find({ status: 'pending' });
    const completed = await Order.find({ status: 'completed' });
    const canceled = await Order.find({ status: 'canceled' });

    res.json({ 
      pending,
      completed,
      canceled
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};