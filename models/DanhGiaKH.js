// models/DanhGiaKH.js
const mongoose = require('mongoose');

const DanhGiaKHSchema = new mongoose.Schema({
  ID_Khoa_Hoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc',
    required: true
  },
  ID_Hoc_Vien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung', // hoặc 'HocVien' nếu bạn có collection riêng
    required: true
  },
  Noi_Dung: {
    type: String,
    required: true
  },
  So_Sao: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
}, {
  timestamps: false,
  collection: 'DanhGiaKH'
});

const DanhGiaKH = mongoose.model('DanhGiaKH', DanhGiaKHSchema);
module.exports = DanhGiaKH;
