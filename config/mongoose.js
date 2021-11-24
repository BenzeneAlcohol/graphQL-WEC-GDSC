const mongoose = require('mongoose');

const connectDB = async() =>{
    await mongoose.connect('mongodb://localhost/graphDB', {useNewUrlParser: true});
    console.log("MongoDB Connected");
}

module.exports = connectDB;