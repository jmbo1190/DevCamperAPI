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

app.get("/api/v1/bootcamps", (req, res) => {
    res.status(200).json( { success: true, msg: 'Return all bootcamps' } ); // later on we will return data from database
});

app.get("/api/v1/bootcamps/:id", (req, res) => {
    res.status(200).json( { success: true, msg: `Return bootcamp ${req.params.id}` } ); 
});

app.post("/api/v1/bootcamps", (req, res) => {
    res.status(200).json( { success: true, msg: 'Create new bootcamp' } ); 
});

app.put("/api/v1/bootcamps/:id", (req, res) => {
    res.status(200).json( { success: true, msg: `Update bootcamp ${req.params.id}` } ); 
});

app.delete("/api/v1/bootcamps/:id", (req, res) => {
    res.status(200).json( { success: true, msg: `Delete bootcamp ${req.params.id}` } ); 
});

const PORT=process.env.PORT || 3000;

app.listen(PORT, console.log(`Express server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`));

