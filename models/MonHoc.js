// models/MonHoc.js (MongoDB - Mongoose)
const mongoose = require('mongoose');

const MonHocSchema = new mongoose.Schema({
  Ten_Mon_Hoc: {
    type: String,
    required: true,
  },
  Mo_Ta: {
    type: String,
    default: null,
  }
}, {
  timestamps: false, // Nếu không cần createdAt/updatedAt
  collection: 'MonHoc' // Đặt tên collection rõ ràng
});

const MonHoc = mongoose.model('MonHoc', MonHocSchema);
module.exports = MonHoc;
