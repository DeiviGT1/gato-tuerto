// backend/add-product.js
const Product = require('./models/Product');

async function addProduct(productData) {
  try {
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return { success: true, product: savedProduct };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = addProduct;