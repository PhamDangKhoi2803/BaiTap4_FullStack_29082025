const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  updateUser,
} = require("../controllers/userController");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,

  favoriteProduct,
  viewProduct,
  buyProduct,
  getSimilarProducts,
  getProductCommentsCount,
  getAllProductsWithOwner,
  getFavoriteProducts,
} = require("../controllers/productController");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const routerAPI = express.Router();
//routerAPI.all("*", auth);
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Routes mới cho sản phẩm
routerAPI.post("/products", auth, createProduct);
routerAPI.get("/products", auth,getAllProducts); // Không cần auth để xem sản phẩm
routerAPI.get("/products/search", auth,searchProducts);
routerAPI.get("/products/:id", getProductById);
routerAPI.put("/products/:id", auth, updateProduct);
routerAPI.delete("/products/:id", auth, deleteProduct);

routerAPI.get("/products_with_owner", getAllProductsWithOwner);

routerAPI.post("/products/:id/favorite", auth, favoriteProduct);
routerAPI.get("/favorites", auth, getFavoriteProducts);
routerAPI.post("/products/:id/viewed", auth, viewProduct);
routerAPI.post("/products/:id/buy", auth, buyProduct);
routerAPI.get("/products/:id/similar", getSimilarProducts);
routerAPI.get("/products/:id/comments/count", getProductCommentsCount);


// Route cần bảo vệ - thêm middleware auth
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);

routerAPI.put("/user/:userId", auth, updateUser);

module.exports = routerAPI; //export default
