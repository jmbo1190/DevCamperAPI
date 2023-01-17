const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: "./config/config.env"});

const app = express();

const PORT=process.env.PORT || 3000;

app.listen(PORT, console.log(`Express server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`));

