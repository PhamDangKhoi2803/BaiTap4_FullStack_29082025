const {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  searchProductsService
} = require("../services/productServices");

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, owner: req.user._id }; // Gán owner
    const product = await createProductService(productData);

    if (!product) {
      return res.status(400).json({
        message: "Không thể tạo sản phẩm!"
      });
    }

    return res.status(201).json({
      message: "Tạo sản phẩm thành công!",
      product
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Lấy tất cả sản phẩm với phân trang
const getAllProducts = async (req, res) => {
  try {
    // Xử lý query params
    const { category, page = 1, limit = 10 } = req.query;
    const query = {owner: req.user._id}; // Mặc định chỉ lấy sản phẩm của user hiện tại
    
    if (category) {
      query.category = category;
    }
    
    const result = await getAllProductsService(query, parseInt(page), parseInt(limit));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm!"
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để cập nhật!"
      });
    }

    // Chỉ owner hoặc admin mới được sửa
    if (product.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Bạn không có quyền sửa sản phẩm này!" });
    }

    const updated = await updateProductService(id, updateData);
    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công!",
      product: updated
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm để xóa!"
      });
    }

    // Chỉ owner hoặc admin mới được xóa
    if (product.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Bạn không có quyền xóa sản phẩm này!" });
    }

    await deleteProductService(id);

    return res.status(200).json({
      message: "Xóa sản phẩm thành công!"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// Tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      promotion,
      minViews,
      maxViews,
      page = 1,
      limit = 10
    } = req.query;

    const params = { keyword, category, minPrice, maxPrice, promotion, minViews, maxViews, owner: req.user._id };
    const result = await searchProductsService(params, parseInt(page), parseInt(limit));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
};