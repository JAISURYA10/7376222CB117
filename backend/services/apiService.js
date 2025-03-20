const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    }
});

module.exports = api;
