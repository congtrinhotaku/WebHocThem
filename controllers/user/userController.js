const AppError = require('../../middlewares/errorHandling');
const bcrypt = require('bcrypt');
const NguoiDung = require('../../models/NguoiDung');
const Otp = require('../../models/otp');
const sendOtp = require('../../helpers/sendOtp');

// ======== Hash password ========
async function securePassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// ======== So sánh password ========
async function comparePassword(enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
}


// ======== LOAD TRANG LOGIN ========
const loadLogin = async (req, res, next) => {
  try {
    res.render('login'); // hoặc render theo tên file EJS bạn đang dùng
  } catch (error) {
    next(new AppError('Không thể tải trang login', 500));
  }
};

// ======== LOAD TRANG REGISTER ========
const loadSignup = async (req, res, next) => {
  try {
    res.render('signup'); // hoặc render theo tên file EJS bạn đang dùng
  } catch (error) {
    next(new AppError('Không thể tải trang register', 500));
  }
};




// ======== ĐĂNG KÝ NGƯỜI DÙNG ========
const signup = async (req, res, next) => {
  try {
    const { fullname, emailval, phone, passwordval, role = 'HocVien' } = req.body;

    const existingUser = await NguoiDung.findOne({ Email: emailval });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email đã tồn tại' });
    }

    const hashedPassword = await securePassword(passwordval);

    await Otp.findOneAndUpdate(
      { email: emailval },
      {
        email: emailval,
        name: fullname,
        password: hashedPassword,
        phone
      },
      { upsert: true }
    );

    req.session.email = emailval;
    return res.status(200).json({ success: true, message: 'Đăng ký thành công. Vui lòng xác nhận OTP.' });

  } catch (error) {
    next(new AppError('Đăng ký thất bại', 500));
  }
};

// ======== GỬI OTP ========
const otpSend = async (req, res, next) => {
  try {
    const email = req.session.email;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await securePassword(generatedOtp);

    await Otp.updateOne({ email }, { $set: { otp: hashedOtp } });

    const user = await Otp.findOne({ email });
    await sendOtp(generatedOtp, user.email, user.name);

    req.session.otpSession = true;
    req.session.otpStartTime = Date.now();
    req.session.otpTime = 75;
    req.session.otpError = null;

    res.redirect('/otp');
  } catch (error) {
    next(new AppError('Gửi OTP thất bại', 500));
  }
};

// ======== TRANG OTP ========
const otpPage = async (req, res, next) => {
  try {
    if (!req.session.otpSession) return res.redirect('/');

    const elapsed = Math.floor((Date.now() - req.session.otpStartTime) / 1000);
    const remaining = Math.max(req.session.otpTime - elapsed, 0);

    res.render('verify-otp', {
      otpError: req.session.otpError,
      time: remaining
    });
  } catch (error) {
    next(new AppError('Hiển thị trang OTP thất bại', 500));
  }
};

// ======== XÁC NHẬN OTP & TẠO NGƯỜI DÙNG ========
const otpPost = async (req, res, next) => {
  try {
    const email = req.session.email;
    const userOtp = await Otp.findOne({ email });

    if (!userOtp || !userOtp.otp) {
      req.session.otpError = 'OTP không hợp lệ';
      return res.redirect('/otp');
    }

    const isMatch = await comparePassword(req.body.otp, userOtp.otp);
    if (!isMatch) {
      req.session.otpError = 'Mã OTP không đúng';
      return res.redirect('/otp');
    }

    const newUser = new NguoiDung({
      Ten_Nguoi_Dung: userOtp.name,
      Email: userOtp.email,
      Mat_khau: userOtp.password,
      So_Dien_Thoai: userOtp.phone,
      Vai_Tro_Nguoi_Dung: 'HocVien'
    });

    const savedUser = await newUser.save();

    req.session.signupSession = true;
    return res.redirect('/');
  } catch (error) {
    next(new AppError('Xác minh OTP thất bại', 500));
  }
};

// ======== GỬI LẠI OTP ========
const resendOtp = async (req, res, next) => {
  try {
    return otpSend(req, res, next);
  } catch (error) {
    next(new AppError('Gửi lại OTP thất bại', 500));
  }
};

// ======== QUÊN MẬT KHẨU ========
const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await NguoiDung.findOne({ Email: email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await securePassword(otp);

    await Otp.findOneAndUpdate(
      { email },
      { email, otp: hashedOtp, name: user.Ten_Nguoi_Dung, password: user.Mat_khau, phone: user.So_Dien_Thoai },
      { upsert: true }
    );

    await sendOtp(otp, email, user.Ten_Nguoi_Dung);

    req.session.resetEmail = email;
    req.session.resetSession = true;
    req.session.otpStartTime = Date.now();
    req.session.otpTime = 75;

    return res.redirect('/reset-password');
  } catch (error) {
    next(new AppError('Lỗi khi yêu cầu quên mật khẩu', 500));
  }
};

// ======== TRANG RESET PASSWORD ========
const resetPassword = async (req, res, next) => {
  try {
    if (!req.session.resetSession) return res.redirect('/');

    const elapsed = Math.floor((Date.now() - req.session.otpStartTime) / 1000);
    const remaining = Math.max(req.session.otpTime - elapsed, 0);

    res.render('reset-password', {
      otpError: req.session.otpError,
      time: remaining
    });
  } catch (error) {
    next(new AppError('Hiển thị trang reset thất bại', 500));
  }
};

// ======== XÁC NHẬN ĐẶT LẠI MẬT KHẨU ========
const resetPasswordPost = async (req, res, next) => {
  try {
    const { otp, password } = req.body;
    const email = req.session.resetEmail;

    const userOtp = await Otp.findOne({ email });
    if (!userOtp || !userOtp.otp) {
      req.session.otpError = 'OTP không hợp lệ';
      return res.redirect('/reset-password');
    }

    const isMatch = await comparePassword(otp, userOtp.otp);
    if (!isMatch) {
      req.session.otpError = 'OTP sai';
      return res.redirect('/reset-password');
    }

    const hashed = await securePassword(password);
    await NguoiDung.updateOne({ Email: email }, { $set: { Mat_khau: hashed } });

    return res.redirect('/login');
  } catch (error) {
    next(new AppError('Đặt lại mật khẩu thất bại', 500));
  }
};


// ======== ĐĂNG NHẬP ========
const login = async (req, res, next) => {
  try {
    const userData = await NguoiDung.findOne({ Email: req.body.email });

    if (userData) {
      const isMatch = await comparePassword(req.body.password, userData.Mat_khau);

      if (isMatch) {
        req.session.loginSession = true;
        req.session.email = userData.Email;
        req.session.role = userData.Vai_Tro_Nguoi_Dung; // nếu bạn cần phân quyền

        return res.redirect('/');
      } else {
        return res.render('login', { error: 'Mật khẩu không chính xác' });
      }
    } else {
      return res.render('login', { error: 'Email không tồn tại' });
    }
  } catch (error) {
    console.log(error);
    next(new AppError('Rất tiếc... Đã xảy ra lỗi khi đăng nhập', 500));
  }
};

// ======== LOAD PROFILE ========
const loadProfile = async (req, res, next) => {
  try {
    const user = await NguoiDung.findOne({ Email: req.session.email });
    if (!user) {
      return res.redirect('/login');
    }
    res.render('userprofile', { user });
  } catch (error) {
    next(new AppError('Không thể tải trang profile', 500));
  }
};

// ======== CẬP NHẬT PROFILE ========
const updateProfile = async (req, res, next) => {
  try {
    const { Ten_Nguoi_Dung, So_Dien_Thoai } = req.body;
    const email = req.session.email;

    const updatedUser = await NguoiDung.findOneAndUpdate(
      { Email: email },
      { Ten_Nguoi_Dung, So_Dien_Thoai },
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    res.redirect('/profile');
  } catch (error) {
    next(new AppError('Cập nhật thông tin thất bại', 500));
  }
};


// ======== ĐĂNG XUẤT ========
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// ======== EXPORT TOÀN BỘ ========
module.exports = {
  signup,
  login,
  otpSend,
  otpPage,
  otpPost,
  resendOtp,
  forgotPassword,
  resetPassword,
  resetPasswordPost,
  logout,
  loadLogin,
  loadSignup,
  loadProfile,
  updateProfile
};
