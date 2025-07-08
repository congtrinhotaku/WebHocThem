const DonHang = require('./models/DonHang'); // Đường dẫn đúng với project của bạn

async function tinhTongDoanhThu() {
  try {
    // Lấy các đơn hàng đã thanh toán kèm thông tin khóa học
    const donHangs = await DonHang.find({ Tinh_Trang_Thanh_Toan: 'Đã thanh toán' })
      .populate('ID_Khoa_Hoc', 'Gia_Khoa_Hoc'); // Chỉ lấy trường giá

    // Tính tổng
    let tongDoanhThu = 0;
    donHangs.forEach(don => {
      const gia = don.ID_Khoa_Hoc?.Gia_Khoa_Hoc || 0;
      tongDoanhThu += gia;
    });

    return tongDoanhThu;
  } catch (error) {
    console.error('Lỗi tính tổng doanh thu:', error);
    throw error;
  }
}

module.exports = {
    tinhTongDoanhThu,
  };
  