const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/dotenv');
const dbConnect = require('./config/db');

// Rutas
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Conexión a la base de datos
dbConnect();

// Rutas
app.use('/orders', orderRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/products', productRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});