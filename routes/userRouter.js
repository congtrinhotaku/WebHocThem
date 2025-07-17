const express = require("express");

const indexController = require("../controllers/user/indexController");
const userController = require("../controllers/user/userController");

const multer = require('multer');
const upload = require('../helpers/multer');
const router = express.Router();

router.get("/", indexController.getTrangChu);



//user router
router.get("/login", userController.loadLogin);
router.get("/register", userController.loadSignup);
router.post("/signup", userController.signup);
router.post("/login", userController.login);




// OTP - Xác minh sau đăng ký
router.get("/otp", userController.otpPage);
router.post("/otp", userController.otpPost);
router.get("/otpsend", userController.otpSend);
router.get("/resend-otp", userController.resendOtp); // Gửi lại OTP



//profile - chỉnh sửa profile, đổi mật khẩu...
router.get("/profile", userController.loadProfile);
router.post("/profile", userController.updateProfile);
// router.post('/upload-avatar/:id', upload.single('avatar'), userController.uploadAvatar);






// Đăng xuất
router.get("/logout", userController.logout);

module.exports = router;