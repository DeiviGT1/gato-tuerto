// backend/controllers/productController.js
const Product = require('../models/Product');
const addProduct = require('../add-product'); // tu lógica para crear un producto

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Página para agregar producto (HTML)
exports.getAddProductPage = (req, res) => {
  // Copia tu HTML de /add-product-page
  const html = `
    <!DOCTYPE html>
    <html>
      <head> <title>Agregar Producto</title> </head>
      <body>
        <!-- Tu formulario, scripts, etc. -->
        <h1>Agregar Nuevo Producto</h1>
        ...
      </body>
    </html>
  `;
  res.send(html);
};

// Agregar nuevo producto (POST)
exports.addProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (
      !productData.name ||
      !productData.brand ||
      !productData.type ||
      !productData.sizes
    ) {
      return res
        .status(400)
        .send({ success: false, error: 'Faltan campos obligatorios' });
    }

    const result = await addProduct(productData);

    if (result.success) {
      return res.status(201).send({ success: true, product: result.product });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};