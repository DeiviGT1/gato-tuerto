// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  completeOrder,
  cancelOrder,
  getOrdersPage,
  getAllOrdersJson, // <--- Por ejemplo, si no lo exportaste en orderController se vuelve undefined
} = require('../controllers/orderController');

router.post('/checkout', createOrder);
router.post('/complete-order', completeOrder);
router.post('/cancel-order', cancelOrder);
router.get('/orders', getOrdersPage);
router.get('/api/all-orders', getAllOrdersJson);

module.exports = router;