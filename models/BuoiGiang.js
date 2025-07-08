// models/BuoiGiang.js
const mongoose = require('mongoose');

const BuoiGiangSchema = new mongoose.Schema({
  ID_Bai_Giang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BaiGiang',
    required: true
  },
  Mo_ta: {
    type: String
  },
  Ten_Buoi_Giang: {
    type: String,
    required: true
  },
  Zoom_url: {
    type: String
  },
  Host_ID: {
    type: String
  },
  Thoi_Gian_Bat_Dau: {
    type: Date
  }
}, {
  timestamps: false,
  collection: 'BuoiGiang'
});

const BuoiGiang = mongoose.model('BuoiGiang', BuoiGiangSchema);
module.exports = BuoiGiang;
