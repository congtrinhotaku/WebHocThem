// models/CauHoi.js
const mongoose = require('mongoose');

const CauHoiSchema = new mongoose.Schema({
  ID_Bai_Thi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiThi',
    required: true
  },
  Cau_Hoi: {
    type: String,
    required: true
  },
  Loai_Cau_Hoi: {
    type: String,
    enum: ['trac_nghiem', 'tu_luan','cau_tra_loi_ngan'], // hoặc bạn có thể bỏ enum nếu không cần giới hạn
    required: true
  },
  Diem_So: {
    type: Number,
    required: true
  },
  LINKS: {
    type: String
  }
}, {
  timestamps: false,
  collection: 'CauHoi'
});

const CauHoi = mongoose.model('CauHoi', CauHoiSchema);
module.exports = CauHoi;

  