const AppError = require('../../middlewares/errorHandling')
const userCollection = require("../../models/NguoiDung");
const bcrypt = require("bcrypt");
const loadUsers = async (req, res, next) => {
  try {
    const perPage = 10; // số lượng dòng mỗi trang
    const page = parseInt(req.query.page) || 1;

    const totalUsers = await userCollection.countDocuments();
    const totalPages = Math.ceil(totalUsers / perPage);

    const users = await userCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.render("users", {
      users,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.log("Lỗi lấy danh sách người dùng:", error);
    next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
  }
};

const edtUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Lấy id từ URL

    const updatedData = {
      Ten_Nguoi_Dung: req.body.Ten_Nguoi_Dung,
      Vai_Tro_Nguoi_Dung: req.body.Vai_Tro_Nguoi_Dung,
      Trang_Thai_Nguoi_Dung: req.body.Trang_Thai_Nguoi_Dung,
      So_Dien_Thoai: req.body.So_Dien_Thoai,
      Email: req.body.Email,
    };

    // Nếu có mật khẩu mới, mã hóa rồi cập nhật
    if (req.body.Mat_khau && req.body.Mat_khau.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.Mat_khau, salt);
      updatedData.Mat_khau = hashedPassword;
    }

    // Nếu có file avatar mới
    if (req.file) {
      updatedData.Avatar_Nguoi_Dung = '/uploads/avatars/' + req.file.filename;
    }

    // Cập nhật người dùng
    await userCollection.findByIdAndUpdate(id, updatedData);

    res.redirect('/admin/users');
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
  }
};


module.exports = {
    loadUsers,
    edtUser,
};