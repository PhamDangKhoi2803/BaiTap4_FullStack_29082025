require("dotenv").config();
const jwt = require("jsonwebtoken");
const { create } = require("../models/users");
const { model } = require("mongoose");

const User = require('../models/users');

const auth = async(req, res, next) => {
  // Định nghĩa white list không cần auth
  const white_lists = ["/v1/api/", "/v1/api/register", "/v1/api/login"];
  
  // Kiểm tra nếu path hiện tại nằm trong white list
  if(white_lists.includes(req.originalUrl)){
    return next();
  }

  // Kiểm tra token
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: "Bạn chưa truyền access token"
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy user từ DB để lấy _id và role
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "User không tồn tại" });

    req.user = {
      _id: user._id,
      email: decoded.email,
      name: decoded.name,
      role: user.role,
      createdBy: 'hoidatit'
    }
    next();
  } catch(error) {
    return res.status(401).json({
      message: "Token bị hết hạn hoặc không hợp lệ"
    });
  }
}

module.exports = auth;