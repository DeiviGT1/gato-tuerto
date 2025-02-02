const express = require('express');
const path = require('path');
const router = express.Router();

// Ruta para servir la vista de búsqueda de inventario
router.get('/search-item', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'search-item.html'));
});

module.exports = router;