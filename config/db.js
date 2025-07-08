const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Kết nối cơ sở dữ liệu thành công")
    } catch (error) {
        console.log("Lỗi kết nối cơ sở dữ liệu:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB
