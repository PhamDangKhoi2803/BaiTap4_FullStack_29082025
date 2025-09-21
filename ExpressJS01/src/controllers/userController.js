const {createUserService, loginService, getUserService, getUserByIdService} = require("../services/userServices");
const User = require("../models/users");
// Đăng ký (Register)
const createUser = async (req, res) => {
  try {
    const {name, email, password} = req.body; 
    const user = await createUserService(name, email, password);

    return res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Đăng nhập (Login)
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);
    return res.status(200).json({
      message: "Login successful!",
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

// // Lấy thông tin 1 user theo id
// const getUser = async (req, res) => {
//   const data = await getUserService();
//   return res.status(200).json(data)
// }


// Cập nhật hàm getUser để xử lý phân quyền
const getUser = async (req, res) => {
  try {
    // Lấy thông tin user từ middleware auth
    const currentUser = req.user;
    
    // Nếu là admin, trả về tất cả users
    if (currentUser.role === "Admin") {
      const data = await getUserService();
      return res.status(200).json(data);
    } 
    // Nếu là user thường, chỉ trả về thông tin của chính user đó
    else {
      const data = await getUserByIdService(currentUser._id);
      return res.status(200).json([data]); // Trả về dạng mảng để frontend xử lý thống nhất
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server"
    });
  }
};

// Thêm API để cập nhật thông tin user
const updateUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;
    const updateData = req.body;
    
    // Chỉ cho phép admin hoặc chính user đó cập nhật thông tin
    if (currentUser.role !== "Admin" && currentUser._id.toString() !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền cập nhật thông tin của user khác!"
      });
    }
    
    // Không cho phép cập nhật role trừ khi là admin
    if (updateData.role && currentUser.role !== "Admin") {
      delete updateData.role;
    }
    
    // Không cho phép cập nhật password qua API này
    if (updateData.password) {
      delete updateData.password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({
        message: "Không tìm thấy user!"
      });
    }
    
    return res.status(200).json({
      message: "Cập nhật thông tin thành công!",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server"
    });
  }
};

// Lấy tất cả users
const getAccount = async (req, res) => {
  return res.status(200).json(req.user)
}

module.exports = {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  updateUser,
};