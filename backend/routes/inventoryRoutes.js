// backend/routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUpdateInventoryPage, updateInventory } = require('../controllers/inventoryController');

// Si quieres guardar el archivo físicamente, crea un diskStorage.
// Como en tu ejemplo usas memoria, definimos:
const upload = multer({ storage: multer.memoryStorage() });

// GET -> página para subir archivo
router.get('/update-inventory-page', getUpdateInventoryPage);

// POST -> subir archivo y procesar
router.post('/update-inventory', upload.single('inventoryFile'), updateInventory);

module.exports = router;