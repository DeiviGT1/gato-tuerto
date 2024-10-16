// backend/api/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Variables de entorno
const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

// Conexión a MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
}

// Configuración de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const accountSid_2 = process.env.TWILIO_ACCOUNT_SID_2;
const authToken_2 = process.env.TWILIO_AUTH_TOKEN_2;
const client_2 = new twilio(accountSid_2, authToken_2);

// Esquema y modelo de Pedido
const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
  email: String,
  paymentMethod: String,
  cardNumber: String,
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number,
      size: String
    }
  ],
  total: Number,
  status: { type: String, default: 'pending' },
  notes: String
});

const Order = mongoose.model('Order', orderSchema);

// Rutas

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/checkout', async (req, res) => {
  try {
    console.log('Request received:', req.body);
    const { name, address, phoneNumber, email, paymentMethod, cardNumber, items, total, notes } = req.body;

    if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
      return res.status(400).send({ success: false, error: 'Missing required fields' });
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
      notes
    });

    const order = await newOrder.save();

    const orderDetails = `
      Name: ${name}
      Address: ${address}
      Phone Number: ${phoneNumber}
      Email: ${email}
      Payment Method: ${paymentMethod}
      ${paymentMethod === 'card' ? `Card Number (last 4 digits): ${cardNumber.slice(-4)}` : ''}
      Total: $${total.toFixed(2)}
      Notes: ${notes || 'No notes provided'}
      Items: \n ${items.map(item => `${item.name}-${item.size} x ${item.quantity}`).join('\n')}
    `;

    await Promise.all([
      client.messages.create({
        body: `New Order Received:\n${orderDetails}`,
        to: process.env.TO_PHONE_NUMBER,
        from: process.env.FROM_PHONE_NUMBER
      }),
      client.messages.create({
        body: `New Order Received:\n${orderDetails}`,
        to: process.env.TO_PHONE_NUMBER_4,
        from: process.env.FROM_PHONE_NUMBER
      })
    ]);

    res.status(200).send({ success: true, sid: order._id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.post('/complete-order', async (req, res) => {
  try {
    const { id } = req.body;
    await Order.findByIdAndUpdate(id, { status: 'completed' });
    res.send({ success: true });
  } catch (err) {
    console.error('Error al completar el pedido:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const auth = req.cookies.auth;

    const pendingOrders = await Order.find({ status: 'pending' });
    const completedOrders = await Order.find({ status: 'completed' });

    let html = `
      <html>
      <head>
        <style>
          /* Tus estilos CSS aquí */
        </style>
      </head>
      <body>
        <!-- Tu HTML y JavaScript aquí -->
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error('Error al obtener los pedidos:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// Exportar como función serverless
module.exports.handler = serverless(app);