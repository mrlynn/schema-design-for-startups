var Author = require('../models/author');
var User = require('../models/user');
var Book = require('../models/book');
var mongoose = require('mongoose');
var faker = require('faker');
var Config = require('../config/config');
const dotenv = require('dotenv');
const chalk = require('chalk');
var winston = require("winston");

var logger = new (winston.createLogger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: process.env.title + '.log' })
    ]
});
dotenv.config({
	path: '.env'
});

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on('error', () => {
	console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
	logger.log('error', '%s MongoDB connection error. Please make sure MongoDB is running.');
	process.exit();
});

Book.find({}, function (err, book) {
    if (err) {
        console.log("Error " + err.message);
    }
    var pages = Math.floor(Math.random() * 600) ; // get a random availability bool
    Author.countDocuments().exec(function (err, count) {
        // Get a random entry
        var random = Math.floor(Math.random() * count)
        // Again query all users but only fetch one offset by our random #
        Author.findOne().skip(random).exec(
            function (err, author) {
                if (err) {
                    console.log('error: ' + err.message);
                }
                review = {
                    user: author._id,
                    text: faker.lorem.words()
                }
                Book.updateOne(
                    { _id: book._id },
                    { $push: { reviews: review} }
                ,function(err,newbook) {
                    console.log("New Book" + JSON.stringify(newbook));
                });
            }
        );
    });
})
