// models/DonHang.js
const mongoose = require('mongoose');

const DonHangSchema = new mongoose.Schema({
  ID_Khoa_Hoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc', // Bạn cần có model KhoaHoc
    required: true
  },
  ID_Hoc_Vien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung', // Giả định model người học tên là NguoiDung
    required: true
  },
  Thoi_Gian_Dang_Ky: {
    type: Date,
    default: Date.now
  },
  Phuong_Thuc_Thanh_Toan: {
    type: String,
    required: true
  },
  Tinh_Trang_Thanh_Toan: {
    type: String,
    required: true
  }
}, {
  timestamps: false,
  collection: 'DonHang'
});

const DonHang = mongoose.model('DonHang', DonHangSchema);
module.exports = DonHang;
