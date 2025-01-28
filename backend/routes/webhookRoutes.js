// backend/routes/webhookRoutes.js

const express = require('express');
const router = express.Router();
const { verifyWebhook, handleWebhook } = require('../controllers/webhookController');

// Ruta para la verificación inicial del webhook (GET)
router.get('/webhook', verifyWebhook);

// Ruta para manejar eventos entrantes (POST)
router.post('/webhook', express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString(); } }), handleWebhook);

module.exports = router;