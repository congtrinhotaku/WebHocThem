// models/DanhMuc.js
const mongoose = require('mongoose');

const DanhMucSchema = new mongoose.Schema({
  Ten_Danh_Muc: {
    type: String,
    required: true
  },
  Danh_Muc_Lon: {
    type: String,
    required: true,
    enum: ['TieuHoc', 'THCS', 'THPT', 'DaiHoc', 'TuHoc'],
  },
  Mo_Ta: {
    type: String
  }
}, {
  timestamps: false,
  collection: 'DanhMuc'
});

const DanhMuc = mongoose.model('DanhMuc', DanhMucSchema);
module.exports = DanhMuc;
