const AppError = require('../../middlewares/errorHandling')
const NguoiDung = require('../../models/NguoiDung');
const GiangVien = require('../../models/GiangVien');

const loadGiangVien = async (req, res, next) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    // Đếm số người dùng là giảng viên
    const totalGVUsers = await NguoiDung.countDocuments({
      Vai_Tro_Nguoi_Dung: 'GiangVien'
    });
    const totalPages = Math.ceil(totalGVUsers / perPage);

    // Truy vấn danh sách giảng viên, phân trang, nối bảng GiangVien
    const giangviens = await NguoiDung.aggregate([
      { $match: { Vai_Tro_Nguoi_Dung: 'GiangVien' } },
      {
        $lookup: {
          from: 'giangviens', // tên collection đúng trong MongoDB
          localField: '_id',
          foreignField: 'maNguoiDung',
          as: 'thongTinGiangVien'
        }
      },
      { $unwind: { path: '$thongTinGiangVien', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * perPage },
      { $limit: perPage }
    ]);

    return res.render('teachers', {
      giangviens,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.error('Lỗi khi tải danh sách giảng viên:', error);
    next(new AppError('Lỗi khi tải danh sách giảng viên', 500));
  }
};

const updateGiangVien = async (req, res) => {
  const maNguoiDung = req.params.id; // ID người dùng (từ bảng NguoiDung)

  const {
    hoTen,
    namSinh,
    gioiTinh,
    trinhDo,
    zalo,
    facebook,
    diaChi,
    soNamKinhNghiem,
    daTungDayO,
    moTaChung,
    trangThai,
  } = req.body;

  const daTungDayArray = daTungDayO ? daTungDayO.split(',').map(s => s.trim()) : [];

  const updateData = {
    maNguoiDung,
    hoTen,
    namSinh,
    gioiTinh,
    trinhDo,
    zalo,
    facebook,
    diaChi,
    soNamKinhNghiem,
    daTungDayO: daTungDayArray,
    moTaChung,
    trangThai,
  };

  if (req.file) {
    updateData.anhDaiDien = req.file.filename;
  }

  try {
    // Kiểm tra xem đã có giảng viên với maNguoiDung này chưa
    const existingGV = await GiangVien.findOne({ maNguoiDung });

    if (existingGV) {
      // Nếu đã có, thì update
      await GiangVien.findOneAndUpdate({ maNguoiDung }, updateData);
    } else {
      // Nếu chưa có, thì tạo mới
      await GiangVien.create(updateData);
    }

    res.redirect('/admin/teachers');
  } catch (err) {
    console.error('Lỗi khi cập nhật/thêm giảng viên:', err);
    res.status(500).send('Lỗi khi cập nhật/thêm giảng viên');
  }
};

module.exports = {
  loadGiangVien,
  updateGiangVien,
};
