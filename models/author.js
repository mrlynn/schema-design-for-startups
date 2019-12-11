var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var authorSchema = new Schema({
    firstName: String,
    lastName: String
});
module.exports = mongoose.model('Author',authorSchema);