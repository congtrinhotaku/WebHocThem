// models/NguoiDung.js (MongoDB - Mongoose)
const mongoose = require('mongoose');

const NguoiDungSchema = new mongoose.Schema({
  Ten_Nguoi_Dung: {
    type: String,
    required: true,
  },
  Mat_khau: {
    type: String,
    required: true,
  },
  Vai_Tro_Nguoi_Dung: {
    type: String,
    required: true,
  },
  Trang_Thai_Nguoi_Dung: {
    type: String,
    default: 'active',
  },
  So_Dien_Thoai: {
    type: String,
  },
  Email: {
    type: String,
    unique: true,
    required: true,
  },
  Avatar_Nguoi_Dung: {
    type: String,
    default: '',
  }
}, {
  timestamps: true, // Nếu không cần createdAt và updatedAt
  collection: 'NguoiDung' // Tên collection cụ thể
});

const NguoiDung = mongoose.model('NguoiDung', NguoiDungSchema);
module.exports = NguoiDung;
