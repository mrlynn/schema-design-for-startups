/**
 * Fake-reviews part 2 - this script generates reviews as embedded documents inside the book collection demonstrating the embedding approach.
 * This approach would optimize for lookups when the book was the primary data element sought but reviews were also required.
 */
var User = require('../models/user');
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
/** 
* Start by looping through all books - reviews, in this case (b) will be placed into the book documents.
*/
Book.find({}, function (err, book) {
    if (err) {
        console.log("Error " + err.message);
    }
    /**
     * Now that we have a book, let's get a randomly selected user and create a review.
     */
    User.countDocuments().exec(function (err, count) {
        // Get a random entry
        var random = Math.floor(Math.random() * count)
        // Again query all users but only fetch one offset by our random #
        User.findOne().skip(random).exec(
            function (err, user) {
                if (err) {
                    console.log('error: ' + err.message);
                }
                review = {
                    user: user._id,
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
