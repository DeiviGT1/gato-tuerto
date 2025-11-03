require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Conexión a la base de datos
const { connectDB } = require('./config/database');
connectDB();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));
app.use(cookieParser());

// Servir archivos estáticos (incluyendo las vistas)
app.use(express.static(path.join(__dirname, 'views')));

// Rutas existentes
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');
app.use(orderRoutes);
app.use(inventoryRoutes);
app.use(productRoutes);
app.use(searchRoutes);


// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Backend está funcionando!');
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});