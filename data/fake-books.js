var Book = require('../models/book');
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
        Author.countDocuments().exec(function (err, count) {
            // Get a random entry
            var available = Math.floor(Math.random() * 1) ; // get a random availability bool
            var pages = Math.floor(Math.random() * 600) ; // get a random availability bool
            var isbn = Math.floor(1000000000000 + Math.random() * 9000000000000)
            var date = faker.date.between('1930-01-01', '2018-12-31');
            var random = Math.floor(Math.random() * count)
            // Again query all users but only fetch one offset by our random #
            Author.findOne().skip(random).exec(
                function (err, author) {
                    // Tada! random user
                    console.log(author)

                    var book = new Book({
                        "title": title,
                        "slug": title,
                        "author": author._id,
                        "available": available,
                        "isbn": isbn.toString(),
                        "pages": pages,
                        "publisher": {
                            "city": faker.address.city(),
                            "date": date,
                            "name": faker.lorem.text()
                        },
                        "subjects": [faker.lorem.text(), faker.lorem.text()],
                        "language": 'EN'
                    });
                    book.save(function (err, newuser) {
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
}
function exit() {
    mongoose.disconnect();
    exit;
}
main().catch(console.err);
