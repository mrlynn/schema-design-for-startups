var mongoose = require('mongoose');
var User = require('../models/user');
var Author = require('../models/author');
var Book = require('../models/book');
var Config = require('../config/config');
const dotenv = require('dotenv');
const chalk = require('chalk');
dotenv.config({
    path: '.env'
});
var connectionstring = 'mongodb://' + Config.dbhost + ':' + Config.dbport + '/' + Config.dbname;
mongoose.connect(connectionstring);
const error = chalk.bold.red;
console.log(chalk.blue.underline('Removing data from %s'),Config.dbname + '/book');
Book.remove({},function(err,results) {
	if (err) {
		console.log(error('error: ', err.message));
		process.exit(-1);
	}
	console.log('Results: ' + JSON.stringify(results));
	console.log("Removing data from " + Config.dbname + '/author');
	Author.remove({}, function(err,results) {
		if (err) {
			console.log('error: ', err.message);
		}
		console.log('Results: ' + JSON.stringify(results));
	});
	Book.remove({}, function(err, results) {
		if (err) {
			console.log('error: ', err.message);
		}
		console.log('Results: ' + JSON.stringify(results));
	});
	User.remove({}, function(err, results) {
		if (err) {
			console.log('error: ', err.message);
		}
		console.log('Results: ' + JSON.stringify(results));
	});
	process.exit();
});
