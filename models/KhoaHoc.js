// models/KhoaHoc.js (MongoDB - Mongoose)
const mongoose = require('mongoose');

const KhoaHocSchema = new mongoose.Schema({
  Ten_Khoa_Hoc: {
    type: String,
    required: true,
  },
  ID_Giang_Vien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiangVien', 
    required: true,
  },
  ID_Mon_Hoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MonHoc', // Tên collection hoặc model liên kết
    required: true,
  },
  ID_Danh_Muc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DanhMuc', // Tên collection hoặc model liên kết
    required: true,
  },
  Mo_Ta: {
    type: String,
  },
  Gia_Tien: {
    type: Number,
    required: true,
  },
  hinhanh: {
    type: [String], 
  }
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
  collection: 'KhoaHoc' // Tên collection trong MongoDB
});

const KhoaHoc = mongoose.model('KhoaHoc', KhoaHocSchema);
module.exports = KhoaHoc;
