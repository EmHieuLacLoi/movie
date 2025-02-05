const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
// Configure global mongoose settings
mongoose.set("debug", true); // Enable debug logging
mongoose.set("bufferTimeoutMS", 30000); // Increase buffer timeout to 30 seconds
const { multipleMongooseToObject } = require("../../utils/mongoose.js");
const userInfo = require("../models/userInfo.js");

class signInController {
    home(req, res, next) {
        res.render('signin')
    }
    
    signIn(req, res, next) {
        let username = req.body.username.trim()
        let password = req.body.password.trim()
        let infoError = {}

        infoError["username"] = username;
        infoError["password"] = password;
        infoError["message"] = "Tài khoản hoặc mật khẩu không đúng!!"
        infoError["status"] = false;
        userInfo
        .find({
            $or: [
                { username: username }
                ]
        })
        .then((user) => {
            if (!user || user.length == 0) {
                infoError["message"] = "Tài khoản chưa có. Đăng kí đi rồi xem nhé! 😃"
                res.render('signin', { infoError })
            }
            else {
                user = multipleMongooseToObject(user)[0]
                console.log(user.password)
                if (bcrypt.compareSync(password, user.password) == false) {
                    res.render('signin', { infoError })
                } else {
                    let userCookie = {
                        name: username,
                        isAdmin: user.isAdmin
                    }
                    res.cookie("user", userCookie)
                    infoError["message"] = "Đăng nhập thành công!!"
                    infoError["status"] = true;
                    res.render('signin', { infoError })
                }
            }
        })
        .catch((error) => {
            console.error("Query Error:", {
                message: error.message,
                name: error.name,
                code: error.code,
            });
        
            // Send error response
            infoError["message"] = `Lỗi rồi. Mã lỗi: ${error.message}`
            res.render("signin", {
                infoError
            });
        });
    }
}

module.exports = new signInController()