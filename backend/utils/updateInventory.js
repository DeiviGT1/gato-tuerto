const Product = require('../models/Product');

exports.updateInventory = async (data) => {
  const updatedSizesMap = new Map();

  for (const product of data) {
    if (product.sizes && Array.isArray(product.sizes)) {
      for (const size of product.sizes) {
        updatedSizesMap.set(size.id, {
          price: size.price,
          inventory: size.inventory,
        });
      }
    }
  }

  const products = await Product.find();
  const bulkOps = [];

  for (const product of products) {
    let sizesUpdated = false;

    for (let i = 0; i < product.sizes.length; i++) {
      const size = product.sizes[i];
      const updatedSizeData = updatedSizesMap.get(size.id);

      if (updatedSizeData) {
        product.sizes[i].price = updatedSizeData.price;
        product.sizes[i].inventory = updatedSizeData.inventory;
      } else {
        product.sizes[i].price = 100000;
        product.sizes[i].inventory = 0;
      }
      sizesUpdated = true;
    }

    if (sizesUpdated) {
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { sizes: product.sizes } },
        },
      });
    }
  }

  if (bulkOps.length > 0) {
    return await Product.bulkWrite(bulkOps);
  }
  return 'No products to update';
};