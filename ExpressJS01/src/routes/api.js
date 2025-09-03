const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
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
routerAPI.get("/products", getAllProducts); // Không cần auth để xem sản phẩm
routerAPI.get("/products/search", searchProducts);
routerAPI.get("/products/:id", getProductById);
routerAPI.put("/products/:id", auth, updateProduct);
routerAPI.delete("/products/:id", auth, deleteProduct);


// Route cần bảo vệ - thêm middleware auth
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);
module.exports = routerAPI; //export default
