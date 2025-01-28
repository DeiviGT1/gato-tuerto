// backend/controllers/orderController.js
const axios = require('axios');
const Order = require('../models/Order');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const allowedPhones = [
  process.env.TO_PHONE_NUMBER,   
  process.env.TO_PHONE_NUMBER_2, 
  process.env.TO_PHONE_NUMBER_3, 
  process.env.TO_PHONE_NUMBER_4, 
  process.env.TO_PHONE_NUMBER_5, 
];

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

    if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
      return res.status(400).send({ success: false, error: 'Missing required fields' });
    }

    // 1. Crear y guardar el pedido en la BD
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

    // 2. Chequear si el phoneNumber está autorizado
    if (allowedPhones.includes(phoneNumber)) {
      
      // 3. Obtener fecha/hora de creación
      // Mongoose crea "createdAt" automáticamente gracias a { timestamps: true }
      const createdDate = new Date(order.createdAt);
      
      // Formatear la fecha/hora en tu zona horaria preferida (ej: Colombia)
      const fechaHora = createdDate.toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
      });
      
      // 4. Armamos el texto con la fecha/hora
      const orderDetails = `
        *Nuevo Pedido Recibido*:
        *Fecha/Hora:* ${fechaHora}
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

      // 5. Enviamos el mensaje a Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: orderDetails,
        parse_mode: 'Markdown',
      });

      console.log(`Mensaje de Telegram enviado para el teléfono ${phoneNumber}`);
    } else {
      console.log(`Teléfono ${phoneNumber} NO está autorizado para recibir notificaciones`);
    }

    // 6. Respuesta final al frontend
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
    let html = ``;

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