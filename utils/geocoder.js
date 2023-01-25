const NodeGeocoder = require("node-geocoder");

const geocoder_options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

console.log("geocoder_options: ", geocoder_options);

const geocoder = NodeGeocoder(geocoder_options);

module.exports = geocoder;