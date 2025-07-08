const AppError = require('../../middlewares/errorHandling')
const bcrypt = require("bcrypt");


const loadLogin = (req, res) => {
    if (req.session.admin) {
      return res.redirect("/admin/dashboard");
    }
    res.render("admin-login", { message: null });
};

const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
      if (email !== ADMIN_EMAIL) {
        return res.render("admin-login", { message: "Email hoặc mật khẩu không chính xác" });
      }
  
      const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD);
      if (!passwordMatch) {
        return res.render("admin-login", { message: "Email hoặc mật khẩu không chính xác" });
      }
  
      req.session.adminVer = true;
      req.session.admin = true;
      return res.redirect("/admin/dashboard");
    } catch (error) {
      console.log("Lỗi đăng nhập Admin:", error);
      next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
    }
  };

const loadDashboard = async (req, res, next) => {
    try {

        return res.render('dashboard', { });

      } catch (error) {
        console.log("Lỗi tải Dashboard:", error);
        next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
      }
}


  
const logout = (req, res, next) => {
    try {
      req.session.admin = false;
      res.redirect("/admin/login");
    } catch (error) {
      console.log("Lỗi đăng xuất:", error);
      next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
    }
  };
  
module.exports = {
    loadLogin,
    login,
    loadDashboard,
    logout,
};