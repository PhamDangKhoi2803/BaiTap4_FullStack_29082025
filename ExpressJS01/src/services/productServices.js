const Product = require("../models/products");

// Tạo sản phẩm mới
const createProductService = async (productData) => {
  try {
    // Thêm thời gian tạo và cập nhật
    productData.createdAt = Date.now();
    productData.updatedAt = Date.now();
    
    const result = await Product.create(productData);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy tất cả sản phẩm
const getAllProductsService = async (query = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
    
    const total = await Product.countDocuments(query);
    
    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy sản phẩm theo ID
const getProductByIdService = async (id) => {
  try {
    const result = await Product.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Cập nhật sản phẩm
const updateProductService = async (id, updateData) => {
  try {
    // Thêm thời gian cập nhật
    updateData.updatedAt = Date.now();
    
    const result = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true } // Trả về document đã được cập nhật
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Xóa sản phẩm
const deleteProductService = async (id) => {
  try {
    const result = await Product.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Tìm kiếm sản phẩm
const searchProductsService = async (keyword, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } }, // Tìm theo tên, không phân biệt hoa thường
        { description: { $regex: keyword, $options: 'i' } } // Tìm theo mô tả
      ]
    };
    
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Export các function
module.exports = {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  searchProductsService
};