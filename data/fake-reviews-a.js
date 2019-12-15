/**
 * Fake-reviews part 1 - this script generates reviews as a separate collection demonstrating the linking and reference approach.
 * Take note that there are only 3 fields book, user, and text. Book, and User are objectids from other collections.
 * This approach would optimize for lookups when the review was the primary data element sought.
 */
var Book = require('../models/book');
var Review = require('../models/review');
var User = require('../models/user');
var Author = require('../models/author');
var mongoose = require('mongoose');
var faker = require('faker');
var Config = require('../config/config');
const dotenv = require('dotenv');
const chalk = require('chalk');
var winston = require("winston");
var slug = require('mongoose-slug-generator');
const yargs = require("yargs");

const options = yargs
 .usage("Usage: fake-books.js -c <Count of Books to created>")
 .option("c", { alias: "count", describe: "Books to be Created", type: "number", demandOption: true })
 .argv;

var logger = new (winston.createLogger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'hackathon.log' })
    ]
});

dotenv.config({
    path: '.env'
});

"use strict";

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, { useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    logger.log('error', '%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});
console.log("Debug: " + process.env.debug); 
mongoose.set('debug', false); //not workig - always true

var done = 0;
var howMany = `${options.count}`;

async function main() {
    for (var i = 0; i < howMany; i++) {
        var title = faker.lorem.text();
        Book.countDocuments().exec(async function (err, bcount) {
            // Get a random entry
            var available = Math.floor(Math.random() * 1) ; // get a random availability bool
            var date = faker.date.between('1930-01-01', '2018-12-31');
            var randomb = Math.floor(Math.random() * bcount)
            Book.findOne().skip(randomb).exec(
                async function (err, book) {
                    User.countDocuments().exec(async function(err,ucount) {
                        var randomu = Math.floor(Math.random() * ucount)
                        User.findOne().skip(randomu).exec(
                            async function(err,user) {
                                var review = new Review({
                                    user: user._id,
                                    book: book._id,
                                    text: faker.lorem.words()
                                });
                                review.save(function (err, newbook) {
                                    if (err) {
                                        console.log('error: ', err.message);
                                    }
                                    done++;
                                    if (done >= howMany) {
                                        exit();
                                    }
                                });
                            }
                        )
                    });
                }
            )
        });
    }
}
function exit() {
    mongoose.disconnect();
    exit;
};
async function getRandomUser(callback) {
    User.countDocuments().exec(function (err, count) {
        var random = Math.floor(Math.random() * count)
        // Again query all users but only fetch one offset by our random #
        User.findOne().skip(random).exec(function(err,user) {
            if (err) {
                console.log("No reading of the user");
                return -1;
            }
            return user;
        });
    });
    callback(null, user);
}

main().catch(console.err);
