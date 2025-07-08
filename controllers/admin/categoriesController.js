const AppError = require('../../middlewares/errorHandling')
const categoriesCollection = require("../../models/DanhMuc");

const loadCategories = async (req, res, next) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const totalCategories = await categoriesCollection.countDocuments();
    const totalPages = Math.ceil(totalCategories / perPage);

    const categories = await categoriesCollection
      .find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.render("categories", {
      categories,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục:", error);
    next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
  }
};


const addCategories = async (req, res) => {
    try {
      const { Ten_Danh_Muc, Danh_Muc_Lon, Mo_Ta } = req.body;
  
      // Validate required fields
      if (!Ten_Danh_Muc || !Danh_Muc_Lon) {
        return res.status(400).send('Tên danh mục và Danh mục lớn là bắt buộc.');
      }
  
      // Tạo danh mục mới
      const newCategory = new categoriesCollection({
        Ten_Danh_Muc,
        Danh_Muc_Lon,
        Mo_Ta
      });
  
      await newCategory.save();
  
      // Chuyển hướng lại trang danh mục
      res.redirect('/admin/categories');
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      res.status(500).send('Lỗi máy chủ.');
    }
  };
  const edtCategories = async (req, res) => {
    try {
      const { id } = req.params;
      const { Ten_Danh_Muc, Danh_Muc_Lon, Mo_Ta } = req.body;
  
      await categoriesCollection.findByIdAndUpdate(id, {
        Ten_Danh_Muc,
        Danh_Muc_Lon,
        Mo_Ta
      });
  
      res.redirect('/admin/categories');
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi khi cập nhật danh mục");
    }
  };
module.exports = {
    loadCategories,
    addCategories,
    edtCategories,
};