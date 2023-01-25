// Database seeder

const fs = require('fs');  // Node built-in module
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load Environment variables
dotenv.config( {path: "./config/config.env"} );

// Load Models
const Bootcamp = require("./models/Bootcamp");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindandModify: false,
});

const bootcamps = JSON.parse( fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8') );

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);

        console.log("Data imported.".green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}



// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();

        console.log("Data destroyed.".red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}


if (['-i', '--import'].includes(process.argv[2])) {
    importData();
} else if (['-d', '--delete'].includes(process.argv[2])) {
    deleteData();
}