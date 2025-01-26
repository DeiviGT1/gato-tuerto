// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Función para generar rutas similares a tu frontend
const generateRoute = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
};

// Función para crear directorios de manera recursiva
const ensureDirectoryExistence = (filePath) => {
  if (fs.existsSync(filePath)) {
    return true;
  }
  ensureDirectoryExistence(path.dirname(filePath));
  fs.mkdirSync(filePath);
};

// Configuración de almacenamiento en memoria para procesamiento con Sharp
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes en formato WebP'));
  },
});

const processImage = async (file, destination, filename) => {
  await sharp(file.buffer)
    .resize(800, 800) // Ajusta el tamaño según tus necesidades
    .toFormat('webp')
    .toFile(path.join(destination, filename));
};

module.exports = { upload, processImage, generateRoute, ensureDirectoryExistence };