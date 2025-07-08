const KhoaHoc = require('../../models/KhoaHoc');
const AppError = require('../../middlewares/errorHandling');
const GiangVien = require('../../models/GiangVien');
const NguoiDung = require('../../models/NguoiDung'); // dùng đúng model
const MonHoc = require('../../models/MonHoc');
const DanhMuc = require('../../models/DanhMuc');

// Danh sách khóa học + tìm kiếm + phân trang
const loadCourses = async (req, res, next) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search?.trim() || "";

    const query = search
      ? { Ten_Khoa_Hoc: { $regex: search, $options: "i" } }
      : {};

    const totalCourses = await KhoaHoc.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / perPage);

    const courses = await KhoaHoc.find(query)
      .populate('ID_Giang_Vien', 'hoTen')
      .populate('ID_Mon_Hoc', 'Ten_Mon_Hoc')
      .populate('ID_Danh_Muc', 'Ten_Danh_Muc')
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Lấy danh sách giảng viên từ NguoiDung có Vai_Tro_Nguoi_Dung là 'GiangVien'
    const [teachers, subjects, categories] = await Promise.all([
      NguoiDung.find({ Vai_Tro_Nguoi_Dung: 'GiangVien' }, 'Ten_Nguoi_Dung'),
      MonHoc.find({}, 'Ten_Mon_Hoc'),
      DanhMuc.find({}, 'Ten_Danh_Muc')
    ]);

    return res.render('courses', {
      courses,
      currentPage: page,
      totalPages,
      search,
      teachers,
      subjects,
      categories
    });

  } catch (err) {
    console.error('Lỗi khi load danh sách khóa học:', err);
    next(new AppError('Lỗi khi tải danh sách khóa học', 500));
  }
};
// Thêm khóa học
const addCourse = async (req, res) => {
    try {
      const {
        Ten_Khoa_Hoc,
        Mo_Ta,
        Gia_Tien,
        ID_Giang_Vien,
        ID_Mon_Hoc,
        ID_Danh_Muc
      } = req.body;
  
      // Validate thông tin bắt buộc
      if (!Ten_Khoa_Hoc || !Gia_Tien || !ID_Giang_Vien || !ID_Mon_Hoc || !ID_Danh_Muc) {
        return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      }
  
      // Xử lý hình ảnh nếu có
      const hinhanh = req.files?.map(file => file.filename) || [];
  
      // Tạo khóa học mới
      const newCourse = new KhoaHoc({
        Ten_Khoa_Hoc,
        Mo_Ta,
        Gia_Tien,
        ID_Giang_Vien,
        ID_Mon_Hoc,
        ID_Danh_Muc,
        hinhanh
      });
  
      await newCourse.save();
  
      // Chuyển hướng về trang danh sách khóa học
      res.redirect('/admin/courses');
    } catch (error) {
      console.error("Lỗi khi thêm khóa học:", error);
      res.status(500).send("Lỗi máy chủ.");
    }
  };
  
  
  // Sửa khóa học
  const editCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        Ten_Khoa_Hoc,
        Mo_Ta,
        Gia_Tien,
        ID_Giang_Vien,
        ID_Mon_Hoc,
        ID_Danh_Muc
      } = req.body;
  
      // Xử lý hình ảnh nếu có (thêm ảnh mới hoặc giữ nguyên nếu không upload mới)
      const hinhanh = req.files?.map(file => file.filename);
  
      // Tạo object update
      const updatedData = {
        Ten_Khoa_Hoc,
        Mo_Ta,
        Gia_Tien,
        ID_Giang_Vien,
        ID_Mon_Hoc,
        ID_Danh_Muc
      };
  
      if (hinhanh && hinhanh.length > 0) {
        updatedData.hinhanh = hinhanh;
      }
  
      await KhoaHoc.findByIdAndUpdate(id, updatedData);
  
      res.redirect('/admin/courses');
    } catch (error) {
      console.error("Lỗi khi cập nhật khóa học:", error);
      res.status(500).send("Lỗi máy chủ.");
    }
  };
   
// Xóa khóa học
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await KhoaHoc.findByIdAndDelete(id);
    res.redirect('/admin/courses');
  } catch (err) {
    console.error("Lỗi khi xóa khóa học:", err);
    res.status(500).send("Lỗi máy chủ.");
  }
};

module.exports = {
  loadCourses,
  addCourse,
  editCourse,
  deleteCourse
};
