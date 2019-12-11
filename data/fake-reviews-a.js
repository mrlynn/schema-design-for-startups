var Author = require('../models/author');
var User = require('../models/user');
var Book = require('../models/book');
var Review = require('../models/review');
var mongoose = require('mongoose');
var async = require('async');
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
const yargs = require("yargs");

const options = yargs
 .usage("Usage: fake-reviews.js -c <Count of Reviews to created>")
 .option("c", { alias: "count", describe: "Reviews to be Created", type: "number", demandOption: true })
 .argv;

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
mongoose.set('debug', true);

async function main() {
    const howMany = `${options.count}`;
    var done = 0;
    var totalUsers = 0;
    for (done=0;done<howMany;done++) {
        // get a random book
        Book.aggregate([{$sample: {size: 1}}]).exec(function (err,book) {
            if (err) {
                console.log("Error " + err.message);
                exit();
            }
            if (done >= howMany) {
                exit();
            }
            console.log("Making review #" + done);
            // Get a random entry
            // Again query all users but only fetch one offset by our random #
            User.aggregate([{$sample: {size: 1}}]).exec(function (err,user) {

                if (err) {
                    console.log('error: ' + err.message);
                    exit();
                }
                console.log("Selected user: " + user.firstName + ' ' + user.lastName);

                review = new Review({
                    user: user._id,
                    book: book._id,
                    rating: faker.random.number(5),
                    text: faker.lorem.paragraph(),
                    created_at: Date.now()
                });
        
                review.save(function(err,newreview) {
                    if (err) {
                        console.log("Error: " + err.message);
                        exit();
                    }
                    console.log("New Review" + JSON.stringify(newreview));
                });
            }
            );
            
        });
        if(done>=totalUsers) {
            exit();
        }
    }
    
}
function exit() {
    mongoose.disconnect();
    exit;
}
function userCount() {
    User.countDocuments().exec( function (err, countUsers) {
        console.log("Total Users: " + countUsers);
        return countUsers;
    });
}
