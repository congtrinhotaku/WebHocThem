const { assign } = require('nodemailer/lib/shared');
const GiangVien = require('../../models/GiangVien'); // Sửa lại đường dẫn model nếu cần
const NguoiDung = require('../../models/NguoiDung');
const AppError = require('../../middlewares/errorHandling')
const path = require('path');
const loadprofile = async (req, res, next) => {
    try {
        const user = await NguoiDung.findOne({ Email: req.session.email });

        if (!user) {
            return res.status(404).send('Không tìm thấy người dùng.');
        }

        let profile = await GiangVien.findOne({ maNguoiDung: user._id });

        if (!profile) {
            const newProfile = new GiangVien({
                maNguoiDung: user._id,
                hoTen: user.Ten_Nguoi_Dung,

            });

            await newProfile.save();
            profile = await GiangVien.findOne({ maNguoiDung: user._id });
        }

        res.render('profile', { profile, user });

    } catch (err) {
        console.error('Lỗi loadprofile:', err);
        res.status(500).send('Lỗi server khi tải profile');
    }
};

const postprofile = async (req, res, next) => {
    try {
        const {
            _id,
            hoTen,
            namSinh,
            gioiTinh,
            zalo,
            facebook,
            diaChi,
            trinhDo,
            soNamKinhNghiem,
            moTaChung,
            trangThai
        } = req.body;
        const updateData = {
            hoTen,
            namSinh,
            gioiTinh,
            zalo,
            facebook,
            diaChi,
            trinhDo,
            soNamKinhNghiem,
            moTaChung,
            trangThai,
            updatedAt: new Date()
        };

        const profile = await GiangVien.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, upsert: false }
        );

        if (!profile) {
            console.log("Không tìm thấy giảng viên với _id:", _id);
            return res.status(404).send('Không tìm thấy giảng viên');
        }

        res.redirect('/giangvien/profile'); // hoặc render lại nếu muốn
    } catch (err) {
        console.log("Lỗi lưu profile:", err);
        next(new AppError('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.', 500));
    }
};



const uploadAvatar = async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.file) {
            return res.status(400).send('Không có file nào được tải lên');
        }

        // Lấy tên file được lưu vào thư mục 'uploads/'
        const avatarPath = path.join('/uploads', req.file.filename); // để EJS dùng hiển thị

        // Cập nhật đường dẫn ảnh trong MongoDB
        await GiangVien.findByIdAndUpdate(id, { anhDaiDien: avatarPath });

        res.redirect('/giangvien/profile');
    } catch (err) {
        console.error('❌ Lỗi upload avatar:', err);
        res.status(500).send('Lỗi khi upload ảnh');
    }
};


module.exports = {
    loadprofile,
    uploadAvatar,
    postprofile
};

// exports.updateGiangVien = async (req, res) => {
//     try {
//         const { name, phone, subject, degree } = req.body;

//         await GiangVien.findByIdAndUpdate(req.params.id, {
//             name,
//             phone,
//             subject,
//             degree,
//         });

//         res.status(200).json({ success: true, message: 'Đã cập nhật' });
//     } catch (error) {
//         console.error('Lỗi cập nhật giảng viên:', error);
//         res.status(500).json({ success: false, message: 'Lỗi server' });
//     }
// };

// exports.uploadAvatar = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'Không có file được upload' });
//         }

//         const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

//         const giangvien = await GiangVien.findByIdAndUpdate(
//             req.params.id,
//             { avatar: base64Image },
//             { new: true }
//         );

//         res.status(200).json({ success: true, newAvatar: giangvien.avatar });
//     } catch (err) {
//         console.error('Lỗi upload avatar:', err);
//         res.status(500).json({ success: false });
//     }
// };

// exports.showProfile = async (req, res) => {
//     try {
//         const users = await GiangVien.find();
//         res.render('profile', { users }); // Hiển thị danh sách giảng viên
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Lỗi server');
//     }
// };
