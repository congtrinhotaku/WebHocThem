const AppError = require('../../middlewares/errorHandling');
const khoahoc = require('../../models/KhoaHoc');
const DanhMuc = require('../../models/DanhMuc');

const getTrangChu = async (req, res, next) => {
    try {
        const allCourses = await khoahoc.find()
            .populate('ID_Danh_Muc')
            .exec();

        // Danh sách danh mục bạn muốn nhóm
        const categories = ['TieuHoc', 'THCS', 'THPT', 'DaiHoc', 'TuHoc'];

        // Nhóm khóa học theo Danh_Muc_Lon và chỉ lấy 6 mỗi nhóm
        const groupedCourses = {};

        categories.forEach(cat => {
            groupedCourses[cat] = allCourses
                .filter(course => course.ID_Danh_Muc?.Danh_Muc_Lon === cat)
                .slice(0, 6);
        });

        res.render('index', groupedCourses); // Truyền từng nhóm theo key tên danh mục
    } catch (err) {
        console.error('Lỗi khi load danh sách khóa học:', err);
        next(new AppError('Lỗi khi tải danh sách khóa học', 500));
    }
};

module.exports = {
    getTrangChu
};

