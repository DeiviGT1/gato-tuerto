// backend/controllers/orderController.js
const twilio = require('twilio');
const Order = require('../models/Order');

// Opcional: si quieres poner la lógica de Twilio en un "servicio" separado
// puedes extraerla a un archivo en la carpeta services/twilioService.js
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

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

    if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
      return res
        .status(400)
        .send({ success: false, error: 'Missing required fields' });
    }

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

    const orderDetails = `
      Name: ${name}
      Address: ${address}
      Phone Number: ${phoneNumber}
      Email: ${email}
      Payment Method: ${paymentMethod}
      ${paymentMethod === 'card' ? `Card Number (last 4 digits): ${cardNumber}` : ''}
      Total: $${total.toFixed(2)}
      Notes: ${notes || 'No notes provided'}
      Items:\n ${items
        .map((item) => `${item.name}-${item.size}  x ${item.quantity}`)
        .join('\n')}
    `;

    // Enviar mensajes de texto
    await client.messages.create({
      body: `New Order Received:\n${orderDetails}`,
      to: process.env.TO_PHONE_NUMBER, // tu número
      from: process.env.FROM_PHONE_NUMBER, // número Twilio
    });


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
  // Aquí va tu lógica que retornaba HTML con la autenticación y las secciones
  // Simplemente copié lo esencial de tu index.js
  try {
    const auth = req.cookies.auth;

    const pendingOrders = await Order.find({ status: 'pending' });
    const completedOrders = await Order.find({ status: 'completed' });
    const canceledOrders = await Order.find({ status: 'canceled' });

    let html = `
      <!-- Tu HTML aquí, con los pedidos inyectados -->
      <!-- ... (omito por brevedad, copia tu HTML y ajusta variables en tu preferencia) -->
    `;

    // Reemplaza tu código HTML completo con tus variables (pendingOrders, etc.)
    // para renderizar la lista de pedidos.

    res.send(html);
  } catch (error) {
    console.error('Error obteniendo página de pedidos:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};

exports.getAllOrdersJson = async (req, res) => {
  try {
    const pending = await Order.find({ status: 'pending' });
    const completed = await Order.find({ status: 'completed' });
    const canceled = await Order.find({ status: 'canceled' });

    // Devolvemos un objeto con cada lista
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