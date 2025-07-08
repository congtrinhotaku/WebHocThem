// models/NopBai.js (MongoDB - Mongoose)
const mongoose = require('mongoose');

const NopBaiSchema = new mongoose.Schema({
  ID_Bai_Thi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiThi',
    required: true
  },
  ID_Hoc_Vien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },
  Thoi_Gian_Nop: {
    type: Date,
    default: Date.now
  },
  Diem_So: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  },
  Danh_Gia: {
    type: String
  }
}, {
  timestamps: false,
  collection: 'NopBai'
});

const NopBai = mongoose.model('NopBai', NopBaiSchema);
module.exports = NopBai;
