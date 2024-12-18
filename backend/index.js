// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const twilio = require('twilio');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const multer = require('multer'); // Importamos multer para manejar la carga de archivos
require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const addProduct = require('./add-product'); // Importa la función de agregar producto
const Product = require('./models/Product'); // Importa el modelo sin redefinir

const app = express();
const port = process.env.PORT || 3001;

const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;

// Conexión a MongoDB
mongoose.connect(
  process.env.MONGODB_URI,
  { dbName: 'el-gato-tuerto' }
)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

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
  status: { type: String, default: 'pending' }, // 'pending' or 'completed'
  notes: String // Añadir el campo 'notes'
});

const Order = mongoose.model('Order', orderSchema);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/checkout', (req, res) => {
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
    notes // Incluir 'notes' al crear el pedido
  });

  newOrder.save()
    .then(order => {
      const orderDetails = `
        Name: ${name}
        Address: ${address}
        Phone Number: ${phoneNumber}
        Email: ${email}
        Payment Method: ${paymentMethod}
        ${paymentMethod === 'card' ? `Card Number (last 4 digits): ${cardNumber}` : ''}
        Total: $${total.toFixed(2)}
        Notes: ${notes || 'No notes provided'} // Mostrar notas
        Items: \n ${items.map(item => `${item.name}-${item.size}  x ${item.quantity}`).join('\n')}
      `;

      // Jose Phone
      client.messages.create({
        body: `New Order Received:\n${orderDetails}`,
        to: process.env.TO_PHONE_NUMBER,
        from: process.env.FROM_PHONE_NUMBER
      })

      //Giuli Phone
      // client.messages.create({
      //   body: `New Order Received:\n${orderDetails}`,
      //   to: process.env.TO_PHONE_NUMBER_2,
      //   from: process.env.FROM_PHONE_NUMBER
      // })

      // Santi Phone
      client.messages.create({
        body: `New Order Received:\n${orderDetails}`,
        to: process.env.TO_PHONE_NUMBER_3,
        from: process.env.FROM_PHONE_NUMBER
      })

      // Gio Phone
      client.messages.create({
        body: `New Order Received:\n${orderDetails}`,
        to: process.env.TO_PHONE_NUMBER_4,
        from: process.env.FROM_PHONE_NUMBER
      })
      
      .then((message) => {
        console.log('Mensaje enviado:', message.sid);
        res.status(200).send({ success: true, sid: message.sid });
      })
      .catch((error) => {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).send({ success: false, error: error.message });
      });
    })
    .catch(err => {
      console.error('Error al guardar el pedido:', err);
      res.status(500).send({ success: false, error: err.message });
    });
});


// Nueva ruta para completar un pedido
app.post('/complete-order', (req, res) => {
  const { id } = req.body;

  Order.findByIdAndUpdate(id, { status: 'completed' })
    .then(() => res.send({ success: true }))
    .catch(err => res.status(500).send({ success: false, error: err.message }));
});

// Ruta para mostrar los pedidos y los botones para completarlos
app.get('/orders', (req, res) => {
  const auth = req.cookies.auth;

  Order.find({ status: 'pending' })
    .then(orders => {
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
            <p><strong>Notas:</strong> ${order.notes || 'No notes provided'}</p>
            <p><strong>Artículos:</strong> ${order.items.map(item => `${item.name} (${item.size}) x ${item.quantity}`).join('<br> ')}</p>
            <button class="complete-button" onclick="completeOrder('${order._id}')">Completar este Pedido</button>
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

      Order.find({ status: 'completed' })
        .then(completedOrders => {
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
                <p><strong>Notas:</strong> ${order.notes || 'No notes provided'}</p>
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
    })
    .catch(err => res.status(500).send({ success: false, error: err.message }));
  })
});

const stream = require('stream'); // For creating stream from buffer


// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, 'inventory.txt'); // Save the uploaded file as inventory.txt
  },
});

const upload = multer({ storage: multer.memoryStorage() });

// Route to update inventory with file upload
app.post('/update-inventory', upload.single('inventoryFile'), async (req, res) => {
  console.log(`[${new Date().toISOString()}] Received a file upload request.`);

  if (!req.file) {
    console.log(`[${new Date().toISOString()}] No file uploaded.`);
    return res
      .status(400)
      .send({ success: false, error: 'No se ha cargado ningún archivo.' });
  }

  console.log(`[${new Date().toISOString()}] Uploaded file received.`);

  const expectedHeaders = ['BARCODE', 'BRAND', 'DESCRIP', 'TYPE', 'SIZE', 'PRICE_C', 'QTY_ON_HND'];
  const fileContent = req.file.buffer.toString('utf-8');

  const parseCsvContent = (content, separator) => {
    return new Promise((resolve, reject) => {
      const inventory = [];
      let headersValid = false;

      const parser = csv({ separator: separator })
        .on('headers', (headers) => {
          headersValid = expectedHeaders.every((header, index) => header === headers[index]);
          if (!headersValid) {
            parser.emit('error', new Error('Invalid headers'));
          }
        })
        .on('data', (row) => {
          row.QTY_ON_HND = row.QTY_ON_HND || 0;
          row.PRICE_C = row.PRICE_C || 0;
          inventory.push(row);
        })
        .on('end', () => {
          if (headersValid) {
            resolve(inventory);
          } else {
            reject(new Error('Headers do not match expected format'));
          }
        })
        .on('error', (err) => {
          reject(err);
        });

      const contentStream = new stream.Readable();
      contentStream.push(content);
      contentStream.push(null);
      contentStream.pipe(parser);
    });
  };

  try {
    console.log(`[${new Date().toISOString()}] Starting CSV parsing.`);
    let inventory = [];
    let separatorUsed = '';

    try {
      inventory = await parseCsvContent(fileContent, '\t');
      separatorUsed = 'tab';
    } catch (err) {
      console.log(`[${new Date().toISOString()}] Failed to parse with tab separator: ${err.message}`);
      inventory = await parseCsvContent(fileContent, ',');
      separatorUsed = 'comma';
    }

    console.log(
      `[${new Date().toISOString()}] Successfully parsed CSV file using ${separatorUsed} separator. Total rows: ${inventory.length}`
    );

    const inventoryMap = new Map();
    inventory.forEach(item => {
      inventoryMap.set(item.BARCODE, {
        QTY_ON_HND: parseInt(item.QTY_ON_HND, 10) || 0,
        PRICE_C: parseFloat(item.PRICE_C) || 0,
      });
    });

    console.log(`[${new Date().toISOString()}] Fetching products from the database.`);
    const products = await Product.find().lean(); // Using lean() for better performance

    console.log(`[${new Date().toISOString()}] Preparing bulk operations.`);
    const bulkOps = [];

    products.forEach(product => {
      let sizesUpdated = false;
      product.sizes.forEach(size => {
        const inventoryData = inventoryMap.get(size.id);
        if (inventoryData) {
          size.price = inventoryData.PRICE_C;
          size.inventory = inventoryData.QTY_ON_HND;
        } else {
          size.price = 100000;
          size.inventory = 0;
        }
        sizesUpdated = true;
      });

      if (sizesUpdated) {
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { sizes: product.sizes } },
          },
        });
      }
    });

    if (bulkOps.length > 0) {
      console.log(`[${new Date().toISOString()}] Executing bulk write operations.`);
      const result = await Product.bulkWrite(bulkOps);
      console.log(`[${new Date().toISOString()}] Bulk operation result:`, result);
    } else {
      console.log(`[${new Date().toISOString()}] No products to update.`);
    }

    return res.send({
      success: true,
      message: 'Inventario actualizado correctamente.',
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error processing the CSV file:`, err.message);
  
    res.status(400).json({
      success: false,
      error: err.message || 'An unexpected error occurred while processing the inventory update.',
    });
  }
});

// Ruta para servir la página de actualización del inventario
// In your backend/index.js

app.get('/update-inventory-page', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Actualizar Inventario</title>
      <style>
        /* Your styles here */
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 2em;
          text-align: center;
          margin-bottom: 20px;
          color: #475169;
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        input[type="file"] {
          margin-bottom: 20px;
        }
        button {
          background-color: #475169;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
        }
        button:hover {
          background-color: #333;
        }
        .loading {
          display: none;
          font-size: 1.2em;
          color: #475169;
          margin-top: 20px;
        }
        .message {
          display: none;
          font-size: 1.2em;
          margin-top: 20px;
        }
        .success {
          color: green;
        }
        .error {
          color: red;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Actualizar Inventario</h1>
        <form id="uploadForm">
          <input type="file" name="inventoryFile" accept=".txt" required>
          <button type="submit">Actualizar</button>
        </form>
        <div class="loading" id="loading">Cargando...</div>
        <div class="message" id="message"></div>
      </div>
      <script>
        document.getElementById('uploadForm').addEventListener('submit', async function(event) {
          event.preventDefault();

          const formData = new FormData(this);
          const loadingElement = document.getElementById('loading');
          const messageElement = document.getElementById('message');

          // Show loading indicator
          loadingElement.style.display = 'block';
          messageElement.style.display = 'none';

          try {
            const response = await fetch('/update-inventory', {
              method: 'POST',
              body: formData
            });

            const result = await response.json();
            loadingElement.style.display = 'none';

            if (response.ok && result.success) {
              messageElement.textContent = result.message;
              messageElement.classList.remove('error');
              messageElement.classList.add('success');
            } else {
              throw new Error(result.error || 'Error al actualizar el inventario');
            }
          } catch (error) {
            messageElement.textContent = error.message;
            messageElement.classList.remove('success');
            messageElement.classList.add('error');
          } finally {
            loadingElement.style.display = 'none';
            messageElement.style.display = 'block';
          }
        });
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

// API endpoint to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Ruta para agregar un nuevo producto
app.post('/add-product', async (req, res) => {
  try {
    const productData = req.body;

    // Validación de datos básicos
    if (!productData.name || !productData.brand || !productData.type || !productData.sizes) {
      return res.status(400).send({ success: false, error: 'Faltan campos obligatorios' });
    }

    const result = await addProduct(productData);

    if (result.success) {
      res.status(201).send({ success: true, product: result.product });
    } else {
      throw new Error(result.error);
    }
  } catch (err) {
    console.error('Error al agregar el producto:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// Ruta para servir la página de agregar un nuevo producto
// backend/index.js

// ... Código existente ...

// Ruta para servir la página de agregar un nuevo producto
app.get('/add-product-page', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Agregar Nuevo Producto</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #475169;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-top: 10px;
          font-weight: bold;
        }
        input, select, textarea {
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .sizes-container {
          margin-top: 20px;
        }
        .size-item {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 10px;
          background-color: #f9f9f9;
          position: relative;
        }
        .remove-size {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: red;
          color: white;
          border: none;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          cursor: pointer;
        }
        .add-size-btn {
          margin-top: 10px;
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .submit-btn {
          margin-top: 20px;
          padding: 15px;
          background-color: #475169;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
        }
        .submit-btn:hover {
          background-color: #333;
        }
        .message {
          margin-top: 20px;
          padding: 10px;
          border-radius: 5px;
          display: none;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Agregar Nuevo Producto</h1>
        <form id="addProductForm">
          <label for="name">Nombre del Producto *</label>
          <input type="text" id="name" name="name" required>

          <label for="brand">Marca *</label>
          <input type="text" id="brand" name="brand" required>

          <label for="typeOfLiquor">Tipo de Licor *</label>
          <input type="text" id="typeOfLiquor" name="typeOfLiquor" required>

          <label for="whereIsFrom">¿De dónde es? *</label>
          <input type="text" id="whereIsFrom" name="whereIsFrom" required>

          <label for="subtype">Subtipo</label>
          <input type="text" id="subtype" name="subtype">

          <label for="description">Descripción</label>
          <textarea id="description" name="description" rows="4"></textarea>

          <div class="sizes-container">
            <h3>Tamaños del Producto *</h3>
            <div id="sizesList">
              <!-- Tamaños dinámicos se agregarán aquí -->
            </div>
            <button type="button" class="add-size-btn" onclick="addSize()">Agregar Tamaño</button>
          </div>

          <button type="submit" class="submit-btn">Agregar Producto</button>
        </form>
        <div id="message" class="message"></div>
      </div>

      <script>
        let sizeCount = 0;

        function addSize() {
          sizeCount++;
          const sizesList = document.getElementById('sizesList');
          const sizeItem = document.createElement('div');
          sizeItem.className = 'size-item';
          sizeItem.innerHTML = \`
            <button type="button" class="remove-size" onclick="removeSize(this)">×</button>
            <label for="sizes[\${sizeCount}][id]">ID del Tamaño *</label>
            <input type="text" name="sizes[\${sizeCount}][id]" required>

            <label for="sizes[\${sizeCount}][size]">Tamaño Descriptivo *</label>
            <input type="text" name="sizes[\${sizeCount}][size]" required>

            <label for="sizes[\${sizeCount}][price]">Precio *</label>
            <input type="number" step="0.01" name="sizes[\${sizeCount}][price]" required>

            <label for="sizes[\${sizeCount}][inventory]">Inventario *</label>
            <input type="number" name="sizes[\${sizeCount}][inventory]" required>

            <label for="sizes[\${sizeCount}][size_ml]">Tamaño en ml</label>
            <input type="number" name="sizes[\${sizeCount}][size_ml]">
          \`;
          sizesList.appendChild(sizeItem);
        }

        function removeSize(button) {
          const sizeItem = button.parentElement;
          sizeItem.remove();
        }

        document.getElementById('addProductForm').addEventListener('submit', async function(event) {
          event.preventDefault();

          const form = event.target;
          const formData = new FormData(form);
          const data = {
            name: formData.get('name'),
            brand: formData.get('brand'),
            type: formData.get('typeOfLiquor'),
            whereIsFrom: formData.get('whereIsFrom'),
            subtype: formData.get('subtype'),
            description: formData.get('description'),
            sizes: []
          };

          // Generar la ruta a partir del nombre del producto
          const generateRoute = (name) => {
            return name.toLowerCase().trim().replace(/\s+/g, '-');
          };

          data.route = generateRoute(data.name);

          // Procesar tamaños
          const sizesKeys = Array.from(formData.keys()).filter(key => key.startsWith('sizes['));
          const sizesSet = new Set();
          sizesKeys.forEach(key => {
            const match = key.match(/sizes$begin:math:display$(\\d+)$end:math:display$$begin:math:display$(\\w+)$end:math:display$/);
            if (match) {
              sizesSet.add(match[1]);
            }
          });

          sizesSet.forEach(index => {
            const size = {
              id: formData.get(\`sizes[\${index}][id]\`),
              size: formData.get(\`sizes[\${index}][size]\`),
              price: parseFloat(formData.get(\`sizes[\${index}][price]\`)),
              inventory: parseInt(formData.get(\`sizes[\${index}][inventory]\`), 10),
              size_ml: formData.get(\`sizes[\${index}][size_ml]\`) ? parseInt(formData.get(\`sizes[\${index}][size_ml]\`), 10) : undefined
            };
            data.sizes.push(size);
          });

          // Validar que al menos un tamaño ha sido agregado
          if (data.sizes.length === 0) {
            showMessage('Debe agregar al menos un tamaño para el producto.', 'error');
            return;
          }

          try {
            const response = await fetch('/add-product', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok && result.success) {
              showMessage('Producto agregado exitosamente.', 'success');
              form.reset();
              document.getElementById('sizesList').innerHTML = '';
              addSize(); // Agregar un tamaño por defecto
            } else {
              throw new Error(result.error || 'Error al agregar el producto.');
            }
          } catch (error) {
            showMessage(error.message, 'error');
          }
        });

        function showMessage(message, type) {
          const messageDiv = document.getElementById('message');
          messageDiv.textContent = message;
          messageDiv.className = \`message \${type}\`;
          messageDiv.style.display = 'block';
        }

        // Agregar un tamaño por defecto al cargar la página
        window.onload = () => {
          addSize();
        };
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});