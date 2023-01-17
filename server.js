const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: "./config/config.env"});

const app = express();

app.get("/", (req, res) => {
    //res.send("<h1>Hello from Express</h1>");  // Content-Type automatically set to: text/html
    //res.send( { name: "Jean-Michel " });      // Content-Type automatically set to: application/json
    //res.json( { name: "Jean-Michel " });      // Content-Type automatically set to: application/json
    //res.sendStatus(400);  // equivalent to: res.status(400).send("Bad Request");
    //res.status(400).json( { success: false } );
    res.status(200).json( { success: true, data: { id: 1 } } );
});

const PORT=process.env.PORT || 3000;

app.listen(PORT, console.log(`Express server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`));

