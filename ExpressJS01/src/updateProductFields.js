const mongoose = require('mongoose');
const Product = require('./models/products');

mongoose.connect('mongodb://localhost:27017/MERNSTACK', { useNewUrlParser: true, useUnifiedTopology: true });

async function updateProducts() {
  const products = await Product.find({});
  for (let product of products) {
    if (!product.favorites) product.favorites = [];
    if (!product.views) product.views = [];
    if (!product.buyers) product.buyers = [];
    await product.save();
    console.log(`Updated product: ${product.name}`);
  }
  mongoose.disconnect();
}

updateProducts();