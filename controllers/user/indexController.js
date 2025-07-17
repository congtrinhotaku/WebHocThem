const AppError = require('../../middlewares/errorHandling');
const khoahoc = require('../../models/KhoaHoc');
const DanhMuc = require('../../models/DanhMuc');
const NguoiDung = require('../../models/NguoiDung');
const GiangVien = require('../../models/GiangVien');
const MonHoc = require('../../models/MonHoc');



// ======== LOAD TRANG CHỦ ========

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

        //session 
        const user = await NguoiDung.findOne({ Email: req.session.email });


        res.render('index', {
            groupedCourses,
            user
        });
    } catch (err) {
        console.error('Lỗi khi load danh sách khóa học:', err);
        next(new AppError('Lỗi khi tải danh sách khóa học', 500));
    }
};
const getDetailCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await khoahoc.findById(courseId);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        const gv = await GiangVien.findById(course.ID_Giang_Vien);
        const mh = await MonHoc.findById(course.ID_Mon_Hoc);
        const dm = await DanhMuc.findById(course.ID_Danh_Muc);

        const user = await NguoiDung.findOne({ Email: req.session.email });




        res.render("course_detail", { course, gv, mh, dm, user }); // truyền dữ liệu sang form
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getTrangChu,
    getDetailCourse
};

