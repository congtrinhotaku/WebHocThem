// models/DapAn.js
const mongoose = require('mongoose');

const DapAnSchema = new mongoose.Schema({
  ID_Cau_Hoi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CauHoi', // Giả định bạn có model tên 'CauHoi'
    required: true,
  },
  Dap_An: {
    type: String,
    required: true,
  },
  Is_Correct: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: false,
  collection: 'DapAn'
});

const DapAn = mongoose.model('DapAn', DapAnSchema);
module.exports = DapAn;
