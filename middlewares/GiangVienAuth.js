const NguoiDung = require("../models/NguoiDung");

module.exports = async function (req, res, next) {
  try {
    if (req.session.loginSession || req.session.signupSession) {
      const user = await NguoiDung.findOne({ Email: req.session.email });

      if (!user) return res.redirect("/login");

      if (user.Trang_Thai_Nguoi_Dung !== 'active') {
        return res.redirect("/blocked");
      }

      if (user.Vai_Tro_Nguoi_Dung !== 'GiangVien') {
        return res.status(403).send("Chỉ giảng viên mới được phép truy cập.");
      }

      req.user = user;
      next();
    } else {
      return res.redirect("/login");
    }
  } catch (err) {
    console.error("authGiangVien middleware error:", err);
    res.status(500).send("Lỗi máy chủ.");
  }
};
