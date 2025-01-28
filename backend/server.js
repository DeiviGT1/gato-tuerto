// backend/server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // Aunque express.json() puede reemplazar bodyParser
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
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); } })); // Para procesar JSON y obtener el rawBody para el webhook
app.use(cookieParser());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

// Rutas
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(orderRoutes);
app.use(inventoryRoutes);
app.use(productRoutes);
// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Backend está funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});