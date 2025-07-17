const KhoaHoc = require('../../models/KhoaHoc');
const GiangVien = require('../../models/GiangVien');
const MonHoc = require('../../models/MonHoc');
const DanhMuc = require('../../models/DanhMuc');
const NguoiDung = require('../../models/NguoiDung');
const BaiGiang = require('../../models/BaiGiang');




const hienThiFormThemBaiGiang = async (req, res) => {
    try {
        // Lấy danh sách các khóa học
        const danhSachKhoaHoc = await KhoaHoc.find();

        // Lấy danh sách bài giảng (hoặc có thể lọc theo khóa học)
        const danhSachBaiGiang = await BaiGiang.find();

        // Lấy thông tin người dùng từ session
        const user = await NguoiDung.findOne({ Email: req.session.email });

        // Render view cho form thêm bài giảng
        res.render('baigiang', {
            danhSachKhoaHoc,  // Danh sách các khóa học
            danhSachBaiGiang, // Danh sách các bài giảng
            user              // Thông tin người dùng
        });
    } catch (err) {
        console.error('Lỗi hiển thị form bài giảng:', err);
        res.status(500).send('Lỗi máy chủ');
    }
};

module.exports = {
    hienThiFormThemBaiGiang,
 
   
};
