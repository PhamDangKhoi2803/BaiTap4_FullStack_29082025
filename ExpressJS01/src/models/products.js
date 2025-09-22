const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  buyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],    // user đã mua
  commentsCount: { type: Number, default: 0 },
  
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;