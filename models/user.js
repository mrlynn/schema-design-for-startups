var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: String,
    firstName: String,
    lastName: String,
    password: String,
    email: String
});

module.exports = mongoose.model('User',userSchema);