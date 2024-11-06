const axios = require("axios");
const BASE_URL = "https://phimapi.com/phim";
const SEARCH_URL = "https://phimapi.com/v1/api/tim-kiem"

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

module.exports = { getData, searchData }