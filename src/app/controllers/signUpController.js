const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
// Configure global mongoose settings
mongoose.set("debug", true); // Enable debug logging
mongoose.set("bufferTimeoutMS", 30000); // Increase buffer timeout to 30 seconds

const userInfo = require("../models/userInfo.js");

class signUpController {
    home(req, res, next) {
        res.render('signup')
    }
    
    signUp(req, res, next) {
        let username = req.body.username.trim()
        let password = req.body.password.trim()
        let pattern = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,10}$/
        let infoError = {}

        infoError["username"] = username;
        infoError["password"] = password;
        infoError["message"] = "Tài khoản này đã tồn tại. Nghĩ cái khác đi!!"
        infoError["status"] = false;
        if (pattern.test(username) && password.length >= 4 && password.length <= 6) {
            userInfo
            .find({
                $or: [
                    { username: username }
                    ]
            })
            .then((user) => {
                if (!user || user.length == 0) {
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(password, salt);
                    userInfo.insertMany([{username: username, password: hash, isAdmin: false, movies: ""}])
                    .then(() => {
                        infoError["message"] = "Đăng kí thành công!"
                        infoError["status"] = true
                        let userCookie = {
                            name: username,
                            isAdmin: false
                        }
                        res.cookie("user", userCookie)
                        res.render('signup', { infoError })
                    })
                    .catch((error) => {
                        console.error(error);
                        infoError["message"] = `Tài khoản này đã tồn tại. Nghĩ cái khác đi!!`
                        res.render('signup', { infoError });
                      });
                }
                else {
                    res.render('signup', { infoError })
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
                res.render("signup", {
                  infoError
                });
            });
        }
        else {
            infoError["message"] = "Tài khoản hoặc mật khẩu chưa đúng cú pháp!!"
            res.render('signup', { infoError })
        }
    }
}

module.exports = new signUpController()