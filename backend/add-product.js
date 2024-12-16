// backend/add-product.js

const Product = require('./models/Product'); // Correcto

/*
 * Agrega un nuevo producto a la base de datos.
 * @param {Object} productData - Datos del producto a agregar.
 * @returns {Promise<Object>} - Producto creado o un error si ocurre.
 */
async function addProduct(productData) {
  try {
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return { success: true, product: savedProduct };
  } catch (err) {
    console.error('Error adding product:', err);
    return { success: false, error: err.message };
  }
}

module.exports = addProduct;