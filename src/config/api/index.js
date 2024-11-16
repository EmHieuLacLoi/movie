const axios = require("axios");
const BASE_URL = "https://ophim1.com/phim";
const SEARCH_URL = "https://phimapi.com/v1/api/tim-kiem"
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

async function searchData(path) {
    try {
        const res = await axios.get(`${SEARCH_URL}?keyword=${path}&limit=10`);
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

module.exports = { getData, searchData, updatedMovieData }