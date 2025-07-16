const KhoaHoc = require('../../models/KhoaHoc');
const GiangVien = require('../../models/GiangVien');
const MonHoc = require('../../models/MonHoc');
const DanhMuc = require('../../models/DanhMuc');
const NguoiDung = require('../../models/NguoiDung');



// Hiển thị form thêm khóa học
const hienThiFormThemKhoaHoc = async (req, res) => {
    try {

        const danhSachMonHoc = await MonHoc.find();
        const danhSachDanhMuc = await DanhMuc.find();
        const user = await NguoiDung.findOne({ Email: req.session.email })

        res.render('khoahoc', {
            danhSachMonHoc,
            danhSachDanhMuc,
            user
        });
    } catch (err) {
        console.error('Lỗi hiển thị form khóa học:', err);
        res.status(500).send('Lỗi máy chủ');
    }
};
const postKhoaHoc = async (req, res) => {
    try {
        const {
            Ten_Khoa_Hoc,
            ID_Mon_Hoc,
            ID_Danh_Muc,
            Gia_Tien,
            Mo_Ta,
        } = req.body;
        const hinhAnhFiles = req.files;
        const danhSachAnh = hinhAnhFiles.map(file => file.filename);
        const Nguoidung = await NguoiDung.findOne({ Email: req.session.email });
        const giangVien = await GiangVien.findOne({ maNguoiDung: Nguoidung._id });



        const khoaHocMoi = new KhoaHoc({
            Ten_Khoa_Hoc,
            ID_Giang_Vien: giangVien._id,
            ID_Mon_Hoc,
            ID_Danh_Muc,
            Gia_Tien,
            Mo_Ta,
            hinhanh: danhSachAnh // Bạn cần đảm bảo schema có field này (Array)
        });

        await khoaHocMoi.save();
        res.redirect('/giangvien/khoahoc');
    } catch (err) {
        console.error('Lỗi khi thêm khóa học:', err);
        res.status(500).send('Lỗi server');
    }
};

module.exports = {
    hienThiFormThemKhoaHoc,
    postKhoaHoc,

};