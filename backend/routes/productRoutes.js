// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getAddProductPage,
  addProduct,
} = require('../controllers/productController');

// GET -> todos los productos
router.get('/api/products', getAllProducts);

// GET -> página para agregar producto
router.get('/add-product-page', getAddProductPage);

// POST -> agregar producto
router.post('/add-product', addProduct);

module.exports = router;