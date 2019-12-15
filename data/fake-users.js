var User = require('../models/user');
var mongoose = require('mongoose');
var faker = require('faker');
var config = require('../config/config');
const dotenv = require('dotenv');
const chalk = require('chalk');
var winston = require("winston");
const yargs = require("yargs");

const options = yargs
 .usage("Usage: fake-users.js -c <Count of Users to created>")
 .option("c", { alias: "count", describe: "Users to be Created", type: "number", demandOption: true })
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
  logger.log('error','%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

const maxUsers = `${options.count}`;
var done=0;

for (var i=0; i < maxUsers; i++) {
	var addr1 = faker.address.streetAddress();
	var city = faker.address.city();
	var state = faker.address.stateAbbr();
	var zipcode = faker.address.zipCode();
	var user = new User({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		address: {
			street: addr1,
			city: city,
			state: state,
			zipcode: zipcode
		},
		email: faker.internet.email()
	});
	user.save(function(err,newuser) {
		if (err) {
			console.log('error: ',err.message);
		}
		console.log("Items: " + JSON.stringify(newuser))
		
		done++;
		if (done>=maxUsers) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
	exit;
}
