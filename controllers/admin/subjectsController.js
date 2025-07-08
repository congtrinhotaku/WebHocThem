const AppError = require('../../middlewares/errorHandling');
const MonHoc = require('../../models/MonHoc'); // Giả sử bạn đã tạo schema MonHoc

const loadSubjects = async (req, res, next) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search?.trim() || "";

    // Tạo điều kiện truy vấn
    const query = search
      ? { Ten_Mon_Hoc: { $regex: search, $options: 'i' } }
      : {};

    // Đếm tổng số bản ghi phù hợp
    const totalSubjects = await MonHoc.countDocuments(query);
    const totalPages = Math.ceil(totalSubjects / perPage);

    // Lấy dữ liệu theo trang và tìm kiếm
    const subjects = await MonHoc.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Render view với dữ liệu
    res.render('subjects', {
      subjects,
      currentPage: page,
      totalPages,
      search // để hiển thị lại giá trị tìm kiếm trong input
    });
  } catch (error) {
    console.error('Lỗi khi tải danh sách môn học:', error);
    next(new AppError('Lỗi máy chủ khi tải danh sách môn học.', 500));
  }
};

module.exports = {
  loadSubjects
};

// Thêm môn học
const addSubject = async (req, res) => {
  try {
    const { Ten_Mon_Hoc, Mo_Ta } = req.body;

    if (!Ten_Mon_Hoc) {
      return res.status(400).send("Tên môn học là bắt buộc.");
    }

    const newSubject = new MonHoc({
      Ten_Mon_Hoc,
      Mo_Ta
    });

    await newSubject.save();
    res.redirect('/admin/subjects');
  } catch (error) {
    console.error("Lỗi khi thêm môn học:", error);
    res.status(500).send("Đã xảy ra lỗi khi thêm môn học.");
  }
};

// Sửa môn học
const editSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { Ten_Mon_Hoc, Mo_Ta } = req.body;

    await MonHoc.findByIdAndUpdate(id, {
      Ten_Mon_Hoc,
      Mo_Ta
    });

    res.redirect('/admin/subjects');
  } catch (error) {
    console.error("Lỗi khi cập nhật môn học:", error);
    res.status(500).send("Đã xảy ra lỗi khi cập nhật môn học.");
  }
};

// Xóa môn học
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    await MonHoc.findByIdAndDelete(id);
    res.redirect('/admin/subjects');
  } catch (error) {
    console.error("Lỗi khi xóa môn học:", error);
    res.status(500).send("Đã xảy ra lỗi khi xóa môn học.");
  }
};

module.exports = {
  loadSubjects,
  addSubject,
  editSubject,
  deleteSubject
};
