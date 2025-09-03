require('dotenv').config();
const mongoose = require('mongoose');
const connection = require('../config/database');
const Product = require('../models/products');

const products = [
  {
    name: 'Laptop Dell XPS 13',
    description: 'Laptop cao cấp với màn hình 13 inch, CPU Intel Core i7, RAM 16GB',
    price: 30000000,
    category: 'electronics',
    image: 'https://example.com/dell-xps-13.jpg',
    stock: 10
  },
  {
    name: 'iPhone 15 Pro',
    description: 'Điện thoại thông minh với camera 48MP, chip A17 Pro',
    price: 28000000,
    category: 'electronics',
    image: 'https://example.com/iphone-15-pro.jpg',
    stock: 15
  },
  {
    name: 'Áo thun nam',
    description: 'Áo thun cotton 100%, màu trắng',
    price: 250000,
    category: 'clothing',
    image: 'https://example.com/white-tshirt.jpg',
    stock: 50
  },
  {
    name: 'Quần jean nữ',
    description: 'Quần jean skinny, màu xanh đậm',
    price: 450000,
    category: 'clothing',
    image: 'https://example.com/blue-jeans.jpg',
    stock: 30
  },
  {
    name: 'Sách Dạy Nấu Ăn',
    description: 'Sách hướng dẫn nấu các món ăn Việt Nam',
    price: 150000,
    category: 'books',
    image: 'https://example.com/cooking-book.jpg',
    stock: 20
  }
];

const seedProducts = async () => {
  try {
    await connection();
    
    // Xóa tất cả sản phẩm hiện có
    await Product.deleteMany({});
    console.log('Đã xóa tất cả sản phẩm cũ');
    
    // Thêm sản phẩm mẫu
    await Product.insertMany(products);
    console.log('Đã thêm sản phẩm mẫu thành công');
    
    // Đóng kết nối
    mongoose.connection.close();
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu:', error);
    process.exit(1);
  }
};

seedProducts();