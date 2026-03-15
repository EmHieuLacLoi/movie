const mongoose = require("mongoose");
const slugify = require('slugify');

// Configure global mongoose settings
mongoose.set("debug", true); // Enable debug logging
mongoose.set("bufferTimeoutMS", 30000); // Increase buffer timeout to 30 seconds

const listMovie = require("../models/listMovie.js");
const { multipleMongooseToObject } = require("../../utils/mongoose.js");
const api = require("../../config/api/index.js");
const newMovie = require("../models/newMovie.js");
const link_img = "https://img.ophim.live/uploads/movies/";
const userInfo = require("../models/userInfo.js");

class HomeController {
  async home(req, res, next) {
    try {
      if (req.cookies["user"] == undefined) return res.render("home", { movies: [], status: false });
      let username = req.cookies["user"].name;
  
      //Tìm user trước
      let user = await userInfo.findOne({ username: username });
  
      if (!user) {
        console.error("Không tìm thấy user!");
        return res.redirect(prevUrl);
      }

      //Lấy danh sách phim user lưu
      if (user.movies == "") {
        res.render("home", { movies: [], status: false, isLoggedIn: true });
      } 
      else {
        let movieSlugs = user.movies.split(";").filter(slug => slug); // Loại bỏ chuỗi rỗng
  
        //Tìm phim trong listMovie dựa trên slug
        let movies = await listMovie.find({ slug: { $in: movieSlugs } });
  
        movies = multipleMongooseToObject(movies);
        res.render("home", { movies, status: true });
      }
    } catch (error) {
      console.error("Lỗi truy vấn dữ liệu:", error)
      res.render("error", {
        status: "Lỗi cập nhật dữ liệu",
      })
    }
  }

  search(req, res, next) {
    const keyword = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const isAjax = req.query.ajax === 'true';

    if (!keyword) {
      if (isAjax) return res.json({ status: "error", message: "Vui lòng nhập từ khóa tìm kiếm" });
      return res.render("error", { status: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    api.searchMovieData(keyword, page)
      .then((data) => {
        if (data.status === 'success' && data.data && data.data.items && data.data.items.length > 0) {
          let list = data.data.items;
          const movie = [];
          
          let domainImage = "https://phimimg.com/";
          if (data.data.APP_DOMAIN_CDN_IMAGE) {
            domainImage = data.data.APP_DOMAIN_CDN_IMAGE + "/uploads/movies/";
          }

          for (let i = 0; i < list.length; i++) {
            const info_movie = {};
            info_movie["name"] = list[i].name;
            info_movie["slug"] = list[i].slug;
            info_movie["origin_name"] = list[i].origin_name;

            let poster = list[i].poster_url || list[i].thumb_url || "";
            if (poster && !poster.startsWith("http")) {
                info_movie["poster"] = domainImage + poster;
            } else {
                info_movie["poster"] = poster;
            }
            
            info_movie["year"] = list[i].year || "";
            movie.push(info_movie);
          }

          const params = data.data.params;
          let hasMore = false;
          if (params && params.pagination) {
             const pagination = params.pagination;
             hasMore = pagination.currentPage < pagination.totalPages; // API limit checks
          }

          if (isAjax) {
            return res.json({ status: 'success', movie, hasMore, currentPage: page });
          }

          res.render("search", { movie, keyword, currentPage: page, hasMore });
        } else {
          console.warn("No movies found");
          if (isAjax) return res.json({ status: "error", message: "Không tìm thấy phim rồi!!!!" });
          res.render("error", { status: "Không tìm thấy phim rồi!!!!" });
        }
      })
      .catch((error) => {
        console.error("Query Error:", {
          message: error.message,
          name: error.name,
          code: error.code,
        });

        // Send error response
        if (isAjax) return res.json({ status: "error", message: "Không tìm thấy phim rồi!!!!" });
        res.render("error", {
          status: "Không tìm thấy phim rồi!!!!",
        });
      });
  }

  // Show cac phim moi cap nhat
  show(req, res, next) {
    let body = 1
    if (req.query.page) {
      body = req.query.page
    }
    api
      .updatedMovieData(body)
      .then((data) => {
        let list = data.items;
        const search_result = [];
        for (let i = 0; i < list.length; i++) {
          const info_movie = {};
          info_movie["name"] = list[i].name;
          info_movie["slug"] = list[i].slug;
          info_movie["origin_name"] = list[i].origin_name;

          if (list[i].poster_url == "" || !list[i].poster_url) {
            if (list[i].thumb_url.includes(link_img)) {
              info_movie["thumb_url"] = list[i].thumb_url;
            } else {
              info_movie["thumb_url"] = link_img + list[i].thumb_url;
            }
          } else {
            if (list[i].poster_url.includes(link_img)) {
              info_movie["thumb_url"] = list[i].poster_url;
            } else {
              info_movie["thumb_url"] = link_img + list[i].poster_url;
            }
          }
          
          info_movie["year"] = list[i].year;
          info_movie["modified_time"] = list[i].modified.time.slice(0, 10)
          search_result.push(info_movie);
        }
        res.render("newMovie", { search_result });
      })
      .catch((error) => {
        let status = error.name
        if (error.response) {
          status = error.response.status;
        }
        res.render("error", { status });
      });
  }
    
  async delete(req, res, next) {
    const id = req.params.id;
  
    try {
      let infoMovie = await listMovie.findOne({ _id: id })
      let username = req.cookies["user"].name;
      let slugRemove = infoMovie.slug

      //Tìm user trước
      let user = await userInfo.findOne({ username: username });
      
      if (!user) {
        console.error("Không tìm thấy user!");
        return res.redirect('/home');
      }

      if (user.movies.includes(slugRemove)) {
        let updateMovie = '';
        let movieSlugs = user.movies.split(";").filter(slug => slug); // Loại bỏ chuỗi rỗng
        for (let  i = 0; i < movieSlugs.length; i++) {
          if (!movieSlugs[i].includes(slugRemove)) {
            updateMovie += movieSlugs[i] + ';'
          }
        }
        //Cập nhật userInfo (Danh sách phim yêu thích)
        await userInfo.updateOne(
          { username: username },
          { $set: { movies: updateMovie } }
        );
      } else {
        return res.redirect(prevUrl);
      }

      res.redirect('/home');
    } catch (error) {
      console.error("Lỗi xóa dữ liệu:", {
        message: error.message,
        name: error.name,
        code: error.code,
      });
      res.render(error, {status: "Có lỗi xảy ra khi xóa dữ liệu." + error});
    }
  }
  

  async put(req, res, next) {
    try {
      const data = req.body;
      const prevUrl = req.headers.referer;
      if (req.cookies["user"] == undefined) {
        return res.redirect("/home")
      }
      let username = req.cookies["user"].name;
  
      //Tìm user trước
      let user = await userInfo.findOne({ username: username });
  
      if (!user) {
        console.error("Không tìm thấy user!");
        return res.redirect("/home")
      }
  
      //Cập nhật danh sách phim của user
      if (user.movies.includes(data.slug)) {
        console.error("Phim đã được lưu trước đó rồi!");
        return res.redirect(prevUrl);
      } else {
        let updateMovie = user.movies ? `${user.movies}${data.slug};` : `${data.slug};`;
    
        //Cập nhật userInfo (Danh sách phim yêu thích)
        const updateUserPromise = userInfo.updateOne(
          { username: username },
          { $set: { movies: updateMovie } }
        );
    
        //Thêm phim vào listMovie nếu chưa có
        const addMoviePromise = listMovie.updateOne(
          { slug: data.slug }, // Kiểm tra nếu đã có phim này thì không thêm nữa
          {
            $setOnInsert: {
              name: data.name,
              slug: data.slug,
              poster: data.poster,
              year: data.year,
            },
          },
          { upsert: true } // Nếu chưa có thì thêm mới
        );
    
        //Chờ cả hai thao tác hoàn thành
        await Promise.all([updateUserPromise, addMoviePromise]);
    
        console.log("Cập nhật thành công!");
        res.redirect(prevUrl);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu: ", error);
      res.render('error', {status: error});
    }
  }    
}

module.exports = new HomeController();
