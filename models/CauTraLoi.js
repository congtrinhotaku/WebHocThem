// models/CauTraLoi.js
const mongoose = require('mongoose');

const CauTraLoiSchema = new mongoose.Schema({
  ID_Cau_Hoi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CauHoi',
    required: true
  },
  ID_Hoc_Vien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung', // Giả sử Học Viên là một loại Người Dùng
    required: true
  },
  Cau_Tra_Loi: {
    type: String,
    required: true
  },
  Diem_So: {
    type: Number,
    default: 0
  }
}, {
  timestamps: false,
  collection: 'CauTraLoi'
});

const CauTraLoi = mongoose.model('CauTraLoi', CauTraLoiSchema);
module.exports = CauTraLoi;
