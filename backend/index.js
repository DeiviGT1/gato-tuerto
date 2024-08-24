// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const cookieParser = require('cookie-parser');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const client = new twilio(accountSid, authToken);

const ordersFilePath = './orders.json';
const completedOrdersFilePath = './completedOrders.json';

// Credenciales de administrador desde variables de entorno
const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

// Cargar pedidos desde los archivos al iniciar la aplicación
let orders = [];
let completedOrders = [];

const loadOrders = () => {
  if (fs.existsSync(ordersFilePath)) {
    const data = fs.readFileSync(ordersFilePath, 'utf-8');
    orders = JSON.parse(data);
  }

  if (fs.existsSync(completedOrdersFilePath)) {
    const data = fs.readFileSync(completedOrdersFilePath, 'utf-8');
    completedOrders = JSON.parse(data);
  }
};

const saveOrders = () => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
  fs.writeFileSync(completedOrdersFilePath, JSON.stringify(completedOrders, null, 2));
};

// Inicializar las listas de pedidos
loadOrders();

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/checkout', (req, res) => {
  const { name, address, phoneNumber, email, paymentMethod, cardNumber, items, total } = req.body;

  if (!name || !address || !phoneNumber || !items || items.length === 0 || !total) {
    return res.status(400).send({ success: false, error: 'Missing required fields' });
  }

  // Guardar el pedido en memoria y persistir en archivo
  orders.push({ id: Date.now(), name, address, phoneNumber, email, paymentMethod, cardNumber, items, total });
  saveOrders(); // Guardar en archivo
  console.log('Pedidos actuales:', orders);

  const orderDetails = `
    Name: ${name}
    Address: ${address}
    Phone Number: ${phoneNumber}
    Email: ${email}
    Payment Method: ${paymentMethod}
    ${paymentMethod === 'card' ? `Card Number (last 4 digits): ${cardNumber}` : ''}
    Total: $${total.toFixed(2)}
    Items: \n ${items.map(item => `${item.name}-${item.size}  x ${item.quantity}`).join('\n')}
  `;

  // Enviar mensaje de texto usando Twilio
  client.messages.create({
    body: `New Order Received:\n${orderDetails}`,
    to: process.env.TO_PHONE_NUMBER, 
    from: process.env.FROM_PHONE_NUMBER
  })
  .then((message) => res.status(200).send({ success: true, sid: message.sid }))
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send({ success: false, error: error.message });
  });
});

// Nueva ruta para completar un pedido
app.post('/complete-order', (req, res) => {
  const { id } = req.body;
  const orderIndex = orders.findIndex(order => order.id === parseInt(id));
  
  if (orderIndex !== -1) {
    const completedOrder = orders.splice(orderIndex, 1)[0];
    completedOrders.push(completedOrder);
    saveOrders(); // Guardar en archivo después de mover el pedido
  }

  res.send({ success: true });
});

// Ruta para mostrar los pedidos y los botones para completarlos
app.get('/orders', (req, res) => {
  const auth = req.cookies.auth;

  let html = `
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 2.5em;
          text-align: center;
          margin-bottom: 20px;
          color: #475169;
        }

        .section-title {
          font-size: 2em;
          margin-top: 40px;
          color: #475169;
        }

        .order-list {
          list-style-type: none;
          padding: 0;
        }

        .order-item {
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .order-item h2 {
          font-size: 1.5em;
          margin-bottom: 10px;
          color: #475169;
        }

        .order-item p {
          margin: 5px 0;
          font-size: 1.2em;
        }

        .order-item .complete-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 10px 20px;
          font-size: 1em;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .order-item .complete-button:hover {
          background-color: #45a049;
          transform: translateY(-2px);
        }

        .order-item .complete-button:active {
          background-color: #3e8e41;
          transform: translateY(0);
        }

        hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 20px 0;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2em;
          }

          .order-item p {
            font-size: 1em;
          }

          .order-item .complete-button {
            padding: 8px 16px;
            font-size: 0.9em;
          }
        }

        /* Estilos para el modal */
        .modal {
          display: ${auth ? 'none' : 'block'};
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 400px;
          text-align: center;
        }

        .modal input[type="text"], .modal input[type="password"] {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }

        .modal button {
          background-color: #475169;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          cursor: pointer;
          width: 100%;
        }

        .modal button:hover {
          background-color: #333;
        }
      </style>
    </head>
    <body>
      <div class="modal">
        <div class="modal-content">
          <h2>Autenticación Requerida</h2>
          <form id="authForm">
            <input type="text" id="username" name="username" placeholder="Usuario" required>
            <input type="password" id="password" name="password" placeholder="Contraseña" required>
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>

      <div class="container" style="display: ${auth ? 'block' : 'none'};">
        <h1>Pedidos Recibidos</h1>

        <div class="pending-orders">
          <h2 class="section-title">Pedidos Pendientes</h2>
          <ul class="order-list">`;

  orders.forEach((order, index) => {
    html += `
      <li class="order-item">
        <h2>Pedido ${index + 1}</h2>
        <p><strong>Nombre:</strong> ${order.name}</p>
        <p><strong>Dirección:</strong> ${order.address}</p>
        <p><strong>Teléfono:</strong> ${order.phoneNumber}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Artículos:</strong> ${order.items.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join('<br> ')}</p>
        <button class="complete-button" onclick="completeOrder(${order.id})">Completar este Pedido</button>
      </li>
      <hr>
    `;
  });

  html += `
          </ul>
        </div>

        <div class="completed-orders">
          <h2 class="section-title">Pedidos Completados</h2>
          <ul class="order-list">`;

  completedOrders.forEach((order, index) => {
    html += `
      <li class="order-item">
        <h2>Pedido ${index + 1}</h2>
        <p><strong>Nombre:</strong> ${order.name}</p>
        <p><strong>Dirección:</strong> ${order.address}</p>
        <p><strong>Teléfono:</strong> ${order.phoneNumber}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Artículos:</strong> ${order.items.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join('<br> ')}</p>
      </li>
      <hr>
    `;
  });

  html += `
          </ul>
        </div>
      </div>

      <script>
        document.getElementById('authForm').addEventListener('submit', function(event) {
          event.preventDefault();
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          if (username === '${adminUser}' && password === '${adminPassword}') {
            document.cookie = "auth=true; max-age=" + (12 * 60 * 60) + "; path=/";
            window.location.reload(); // Recargar la página después de la autenticación
          } else {
            alert('Usuario o contraseña incorrectos');
          }
        });

        if (document.cookie.includes('auth=true')) {
          document.querySelector('.modal').style.display = 'none';
          document.querySelector('.container').style.display = 'block';
          
          // Recargar la página cada 5 segundos para actualizar los pedidos
          setInterval(() => {
            window.location.reload();
          }, 5000); // 5000 milisegundos = 5 segundos
        }

        function completeOrder(id) {
          fetch('/complete-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              window.location.reload(); // Recargar la página para reflejar la actualización
            } else {
              alert('Error al completar el pedido');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('Error al completar el pedido');
          });
        }
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
        