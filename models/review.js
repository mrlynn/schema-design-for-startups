var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    "user": {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    "book": {
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    "rating": Number,
    "text": String,
    created_at: Date
});
module.exports = mongoose.model('Review',reviewSchema);
