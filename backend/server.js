const path = require('path');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Conexión a la base de datos
const { connectDB } = require('./config/database');
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// ### Aquí montas la carpeta que contiene los .html
// Por ejemplo, si se llama "views":
app.use(express.static(path.join(__dirname, 'views')));

// Rutas (API) separadas:
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(orderRoutes);
app.use(inventoryRoutes);
app.use(productRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});