// models/BinhLuan.js
const mongoose = require('mongoose');

const BinhLuanSchema = new mongoose.Schema({
  ID_Bai_Giang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiGiang',
    required: true
  },
  ID_Hoc_Vien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  Noi_Dung: {
    type: String,
    required: true
  },
  MediaLink: {
    type: String
  }
}, {
  timestamps: false,
  collection: 'BinhLuan'
});

const BinhLuan = mongoose.model('BinhLuan', BinhLuanSchema);
module.exports = BinhLuan;
