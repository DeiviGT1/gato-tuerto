// // backend/api/index.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const twilio = require('twilio');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const serverless = require('serverless-http');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(cookieParser());

// // Variables de entorno
// const adminUser = process.env.ADMIN_USER;
// const adminPassword = process.env.ADMIN_PASSWORD;

// // Conexión a MongoDB
// if (!mongoose.connection.readyState) {
//   mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Failed to connect to MongoDB', err));
// }

// // Configuración de Twilio
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// const accountSid_2 = process.env.TWILIO_ACCOUNT_SID_2;
// const authToken_2 = process.env.TWILIO_AUTH_TOKEN_2;
// const client_2 = twilio(accountSid_2, authToken_2);

// // Esquema y modelo de Pedido
// const orderSchema = new mongoose.Schema({
//   name: String,
//   address: String,
//   phoneNumber: String,
//   email: String,
//   paymentMethod: String,
//   cardNumber: String,
//   items: [
//     {
//       id: String,
//       name: String,
//       quantity: Number,
//       price: Number,
//       size: String
//     }
//   ],
//   total: Number,
//   status: { type: String, default: 'pending' },
//   notes: String
// });

// const Order = mongoose.model('Order', orderSchema);

// // Rutas

// // Ruta principal
// app.get('/', (req, res) => {
//   res.send('Backend is running!');
// });

// // Ruta de checkout
// app.post('/checkout', async (req, res) => {
//   try {
//     console.log('Request received:', req.body);
//     const { name, address, phoneNumber, email, paymentMethod, cardNumber, items, total, notes } = req.body;

//     // Validaciones
//     if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
//       return res.status(400).send({ success: false, error: 'Missing required fields' });
//     }

//     // Crear nuevo pedido
//     const newOrder = new Order({
//       name,
//       address,
//       phoneNumber,
//       email,
//       paymentMethod,
//       cardNumber,
//       items,
//       total,
//       notes
//     });

//     const order = await newOrder.save();

//     // Detalles del pedido
//     const orderDetails = `
//       Name: ${name}
//       Address: ${address}
//       Phone Number: ${phoneNumber}
//       Email: ${email}
//       Payment Method: ${paymentMethod}
//       ${paymentMethod === 'card' ? `Card Number (last 4 digits): ${cardNumber.slice(-4)}` : ''}
//       Total: $${total.toFixed(2)}
//       Notes: ${notes || 'No notes provided'}
//       Items: \n ${items.map(item => `${item.name}-${item.size} x ${item.quantity}`).join('\n')}
//     `;

//     // Enviar mensajes con Twilio
//     await Promise.all([
//       client.messages.create({
//         body: `New Order Received:\n${orderDetails}`,
//         to: process.env.TO_PHONE_NUMBER,
//         from: process.env.FROM_PHONE_NUMBER
//       }),
//       client_2.messages.create({
//         body: `New Order Received:\n${orderDetails}`,
//         to: process.env.TO_PHONE_NUMBER_2,
//         from: process.env.FROM_PHONE_NUMBER
//       })
//       // Puedes agregar más clientes si es necesario
//     ]);

//     res.status(200).send({ success: true, sid: order._id });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send({ success: false, error: error.message });
//   }
// });

// // Ruta para completar un pedido
// app.post('/complete-order', async (req, res) => {
//   try {
//     const { id } = req.body;
//     await Order.findByIdAndUpdate(id, { status: 'completed' });
//     res.send({ success: true });
//   } catch (err) {
//     console.error('Error al completar el pedido:', err);
//     res.status(500).send({ success: false, error: err.message });
//   }
// });

// // Ruta para mostrar los pedidos
// app.get('/orders', async (req, res) => {
//   try {
//     const auth = req.cookies.auth;

//     const pendingOrders = await Order.find({ status: 'pending' });
//     const completedOrders = await Order.find({ status: 'completed' });

//     let html = `
//       <html>
//       <head>
//         <style>
//           /* Tus estilos CSS aquí */
//           /* ... (omisión por brevedad) ... */
//           body {
//             font-family: 'Arial', sans-serif;
//             background-color: #f5f5f5;
//             margin: 0;
//             padding: 20px;
//             color: #333;
//           }
//           .container {
//             max-width: 1200px;
//             margin: 0 auto;
//             padding: 20px;
//             background-color: white;
//             border-radius: 8px;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           }
//           h1 {
//             font-size: 2.5em;
//             text-align: center;
//             margin-bottom: 20px;
//             color: #475169;
//           }
//           .section-title {
//             font-size: 2em;
//             margin-top: 40px;
//             color: #475169;
//           }
//           .order-list {
//             list-style-type: none;
//             padding: 0;
//           }
//           .order-item {
//             border: 1px solid #ddd;
//             border-radius: 8px;
//             margin-bottom: 20px;
//             padding: 15px;
//             background-color: #fff;
//             box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//           }
//           .order-item h2 {
//             font-size: 1.5em;
//             margin-bottom: 10px;
//             color: #475169;
//           }
//           .order-item p {
//             margin: 5px 0;
//             font-size: 1.2em;
//           }
//           .order-item .complete-button {
//             background-color: #4CAF50;
//             color: white;
//             border: none;
//             border-radius: 5px;
//             padding: 10px 20px;
//             font-size: 1em;
//             cursor: pointer;
//             transition: background-color 0.3s ease, transform 0.2s ease;
//           }
//           .order-item .complete-button:hover {
//             background-color: #45a049;
//             transform: translateY(-2px);
//           }
//           .order-item .complete-button:active {
//             background-color: #3e8e41;
//             transform: translateY(0);
//           }
//           hr {
//             border: none;
//             border-top: 1px solid #ddd;
//             margin: 20px 0;
//           }
//           @media (max-width: 768px) {
//             h1 {
//               font-size: 2em;
//             }
//             .order-item p {
//               font-size: 1em;
//             }
//             .order-item .complete-button {
//               padding: 8px 16px;
//               font-size: 0.9em;
//             }
//           }
//           /* Estilos para el modal */
//           .modal {
//             display: ${auth ? 'none' : 'block'};
//             position: fixed;
//             z-index: 1;
//             left: 0;
//             top: 0;
//             width: 100%;
//             height: 100%;
//             background-color: rgba(0, 0, 0, 0.5);
//           }
//           .modal-content {
//             background-color: #fefefe;
//             margin: 15% auto;
//             padding: 20px;
//             border: 1px solid #888;
//             width: 80%;
//             max-width: 400px;
//             text-align: center;
//           }
//           .modal input[type="text"], .modal input[type="password"] {
//             width: 100%;
//             padding: 12px;
//             margin: 8px 0;
//             display: inline-block;
//             border: 1px solid #ccc;
//             box-sizing: border-box;
//           }
//           .modal button {
//             background-color: #475169;
//             color: white;
//             padding: 14px 20px;
//             margin: 8px 0;
//             border: none;
//             cursor: pointer;
//             width: 100%;
//           }
//           .modal button:hover {
//             background-color: #333;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="modal">
//           <div class="modal-content">
//             <h2>Autenticación Requerida</h2>
//             <form id="authForm">
//               <input type="text" id="username" name="username" placeholder="Usuario" required>
//               <input type="password" id="password" name="password" placeholder="Contraseña" required>
//               <button type="submit">Ingresar</button>
//             </form>
//           </div>
//         </div>
//         <div class="container" style="display: ${auth ? 'block' : 'none'};">
//           <h1>Pedidos Recibidos</h1>
//           <div class="pending-orders">
//             <h2 class="section-title">Pedidos Pendientes</h2>
//             <ul class="order-list">`;

//     pendingOrders.forEach((order, index) => {
//       html += `
//         <li class="order-item">
//           <h2>Pedido ${index + 1}</h2>
//           <p><strong>Nombre:</strong> ${order.name}</p>
//           <p><strong>Dirección:</strong> ${order.address}</p>
//           <p><strong>Teléfono:</strong> ${order.phoneNumber}</p>
//           <p><strong>Email:</strong> ${order.email}</p>
//           <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
//           <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
//           <p><strong>Notas:</strong> ${order.notes || 'No se proporcionaron notas'}</p>
//           <p><strong>Artículos:</strong> ${order.items.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join('<br> ')}</p>
//           <button class="complete-button" onclick="completeOrder('${order._id}')">Completar este Pedido</button>
//         </li>
//         <hr>
//       `;
//     });

//     html += `
//             </ul>
//           </div>
//           <div class="completed-orders">
//             <h2 class="section-title">Pedidos Completados</h2>
//             <ul class="order-list">`;

//     completedOrders.forEach((order, index) => {
//       html += `
//         <li class="order-item">
//           <h2>Pedido ${index + 1}</h2>
//           <p><strong>Nombre:</strong> ${order.name}</p>
//           <p><strong>Dirección:</strong> ${order.address}</p>
//           <p><strong>Teléfono:</strong> ${order.phoneNumber}</p>
//           <p><strong>Email:</strong> ${order.email}</p>
//           <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
//           <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
//           <p><strong>Notas:</strong> ${order.notes || 'No se proporcionaron notas'}</p>
//           <p><strong>Artículos:</strong> ${order.items.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join('<br> ')}</p>
//         </li>
//         <hr>
//       `;
//     });

//     html += `
//             </ul>
//           </div>
//         </div>

//         <script>
//           document.getElementById('authForm').addEventListener('submit', function(event) {
//             event.preventDefault();
//             const username = document.getElementById('username').value;
//             const password = document.getElementById('password').value;

//             if (username === '${adminUser}' && password === '${adminPassword}') {
//               document.cookie = "auth=true; max-age=" + (12 * 60 * 60) + "; path=/";
//               window.location.reload();
//             } else {
//               alert('Usuario o contraseña incorrectos');
//             }
//           });

//           if (document.cookie.includes('auth=true')) {
//             document.querySelector('.modal').style.display = 'none';
//             document.querySelector('.container').style.display = 'block';

//             setInterval(() => {
//               window.location.reload();
//             }, 5000);
//           }

//           function completeOrder(id) {
//             fetch('/complete-order', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ id: id }),
//             })
//             .then(response => response.json())
//             .then(data => {
//               if (data.success) {
//                 window.location.reload();
//               } else {
//                 alert('Error al completar el pedido');
//               }
//             })
//             .catch((error) => {
//               console.error('Error:', error);
//               alert('Error al completar el pedido');
//             });
//           }
//         </script>
//       </body>
//       </html>
//     `;

//     res.send(html);
//   } catch (err) {
//     console.error('Error al obtener los pedidos:', err);
//     res.status(500).send({ success: false, error: err.message });
//   }
// });

// // Exportar la aplicación Express como una función handler para Vercel
// module.exports = serverless(app);

// backend/api/index.js

const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Ruta principal básica
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Exportar la aplicación Express como una función serverless
module.exports = serverless(app);