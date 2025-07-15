const mongoose = require('mongoose');

const GiangVienSchema = new mongoose.Schema({
  maNguoiDung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: true
  },

  hoTen: {
    type: String,
    required: true
  },
  namSinh: {
    type: Number,
   
  },
  gioiTinh: {
    type: String,
    enum: ['nam', 'nu'],
  
  }, 
  zalo: {
    type: String
  },
  facebook: {
    type: String // URL hoặc username Facebook
  },
  
  diaChi: {
    type: String
  },
  anhDaiDien: {
    type: String // đường dẫn file ảnh hoặc URL
  },

  trinhDo: {
    type: String,
    enum: ['cu-nhan', 'thac-si', 'tien-si', 'ky-su', 'cc-su-pham'],
  
  },

  bangCap: [{
    tenBangCap: {
      type: String,
     
    },
    noiCap: String,
    namCap: Number
  }],

  soNamKinhNghiem: {
    type: Number,
   
  },
  daTungDayO: [{
    type: String
  }],
  moTaChung: {
    type: String
  },

  trangThai: {
    type: String,
    enum: ['Hoạt động', 'Tạm khóa', 'Đã nghỉ'],
    default: 'Hoạt động'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('GiangVien', GiangVienSchema);
