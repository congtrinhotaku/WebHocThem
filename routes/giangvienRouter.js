const express = require('express');
const router = express.Router();
const multer = require('multer');
const giangvienController = require('../controllers/giangvien/profileControllers');
const GiangVienAuth = require('../middlewares/giangvienAuth');


// Middleware upload
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Hiển thị trang profile giảng viên
router.get('/profile', GiangVienAuth, giangvienController.loadprofile);

router.post('/upload-avatar/:id', upload.single('avatar'), giangvienController.uploadAvatar);


// // Cập nhật thông tin giảng viên
// router.post('/capnhat/:id', giangvienController.updateGiangVien);

// // Upload ảnh đại diện giảng viên
// router.post('/upload-avatar/:id', upload.single('avatar'), giangvienController.uploadAvatar);

module.exports = router;
