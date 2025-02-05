const axios = require("axios");
const BASE_URL = "https://ophim1.com/phim";
const UPDATED_MOVIE_URL = "https://ophim1.com/danh-sach/phim-moi-cap-nhat"

async function getData(path) {
    try {
        const res = await axios.get(`${BASE_URL}${path}`);
        return res.data;
    } catch (e) {
        console.log("Error get data: ", e);
        throw e; 
    }
}

async function updatedMovieData(path) {
    try {
        const res = await axios.get(`${UPDATED_MOVIE_URL}?page=${path}`);
        return res.data;
    } catch (e) {
        console.log("Error get data: ", e);
        throw e; 
    }
}

async function checkImageUrls(urls) {
  const results = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });

      // Kiểm tra Content-Type có phải là ảnh không
      const contentType = response.headers["content-type"];
      if (!contentType.startsWith("image/")) {
        results.push({ url, status: false, message: "Not an image" });
      } else {
        results.push({ url, status: true });
      }
    } catch (error) {
      results.push({
        url,
        status: "error",
        message: `HTTP Error: ${error.response?.status || "Unknown"}`,
      });
    }
  }

  return results;
}

module.exports = { getData, updatedMovieData, checkImageUrls }