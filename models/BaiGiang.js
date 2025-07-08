// models/BaiGiang.js (Mongoose)
const mongoose = require('mongoose');

const BaiGiangSchema = new mongoose.Schema({
  ID_Khoa_Hoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc', // liên kết với model KhoaHoc
    required: true,
  },
  Ten_Bai_Giang: {
    type: String,
    required: true,
  },
  Video_url: {
    type: String,
  },
  Mo_Ta: {
    type: String,
  },
  Anh_Bia: {
    type: String,
  },
  Thu_Tu: {
    type: Number,
  },
  Hoc_Thu: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // tự động thêm createdAt và updatedAt
  collection: 'BaiGiang'
});

const BaiGiang = mongoose.model('BaiGiang', BaiGiangSchema);
module.exports = BaiGiang;
