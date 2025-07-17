const express = require('express');
const router = express.Router();
const multer = require('multer');
const giangvienController = require('../controllers/giangvien/profileControllers');
const baiGiangController = require('../controllers/giangvien/baigiangControllers');
const khoahocController = require('../controllers/giangvien/khoahocControllers');


const GiangVienAuth = require('../middlewares/giangvienAuth');
const upload = require('../helpers/multer');


// Hiển thị trang profile giảng viên
router.get('/profile', GiangVienAuth, giangvienController.loadprofile);
router.post('/profile',GiangVienAuth, giangvienController.postprofile);
router.post('/upload-avatar/:id', upload.single('avatar'), giangvienController.uploadAvatar);

// ==== BÀI GIẢNG ====
router.get('/baigiang', GiangVienAuth,baiGiangController.hienThiFormThemBaiGiang);



// ==== Khóa Học ====
router.get('/khoahoc',GiangVienAuth, khoahocController.hienThiFormThemKhoaHoc);
router.post('/khoahoc/them', GiangVienAuth, upload.array('hinhanh', 5), khoahocController.postKhoaHoc);




module.exports = router;
