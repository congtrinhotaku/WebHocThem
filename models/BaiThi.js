// models/BaiThi.js (Mongoose)
const mongoose = require('mongoose');

const BaiThiSchema = new mongoose.Schema({
  ID_Khoa_Hoc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KhoaHoc', // Liên kết với bảng KhoaHoc
    required: true
  },
  Ten_Bai_Thi: {
    type: String,
    required: true
  },
  LINKS: {
    type: String
  },
  Thoi_Gian_Bat_Dau: {
    type: Date
  },
  Thoi_Han: {
    type: Number // Đơn vị: phút hoặc giờ tùy theo thiết kế
  }
}, {
  timestamps: true, // Thêm createdAt và updatedAt
  collection: 'BaiThi'
});

const BaiThi = mongoose.model('BaiThi', BaiThiSchema);
module.exports = BaiThi;
