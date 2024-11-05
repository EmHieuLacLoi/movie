const axios = require("axios");
const BASE_URL = "https://ophim1.com/phim";

async function getData(path) {
    try {
        const res = await axios.get(`${BASE_URL}${path}`);
        return res.data;
    } catch (e) {
        console.log("Error get data: ", e);
        throw e; 
    }
}

module.exports = { getData }