const express = require("express");

const adminController = require("../controllers/admin/adminController");
const usersController = require("../controllers/admin/usersController");
const categoriesController = require("../controllers/admin/categoriesController");
const giangVienController = require('../controllers/admin/giangVienController');
const subjectController = require('../controllers/admin/subjectsController'); 
const courseController = require('../controllers/admin/coursesController');
const adminAuth = require ("../middlewares/adminAuth");

const multer = require('multer');
const upload = require('../helpers/multer');
const router = express.Router();

// Admin Auth
router.get("/", adminAuth, adminController.loadDashboard); 
router.get("/login", adminController.loadLogin);
router.post("/login", adminController.login);
router.get("/dashboard", adminAuth, adminController.loadDashboard);
router.get("/logout", adminAuth, adminController.logout);

// Users
router.get("/users", adminAuth, usersController.loadUsers);
router.put("/users/:id", upload.single('Avatar_Nguoi_Dung'), usersController.edtUser);

// Categories
router.get("/categories", adminAuth, categoriesController.loadCategories);
router.post("/categories", adminAuth, categoriesController.addCategories);
router.put("/categories/:id", adminAuth, categoriesController.edtCategories);

// Teachers (Giảng viên)
router.get("/teachers", adminAuth, giangVienController.loadGiangVien);
router.put("/giangvien/:id", upload.single('anhDaiDien'), giangVienController.updateGiangVien);

// Subjects (Môn học) 
router.get("/subjects", adminAuth, subjectController.loadSubjects);
router.post("/subjects", adminAuth, subjectController.addSubject);
router.put("/subjects/:id", adminAuth, subjectController.editSubject);
router.delete("/subjects/:id", adminAuth, subjectController.deleteSubject);

// Courses
router.get('/courses',adminAuth, courseController.loadCourses);
router.post('/courses',adminAuth, upload.array('hinhanh'), courseController.addCourse);
router.put('/courses/:id',adminAuth, upload.array('hinhanh'), courseController.editCourse);
router.delete('/courses/:id',adminAuth, courseController.deleteCourse);



module.exports = router;
