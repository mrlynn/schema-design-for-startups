var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    "title": String,
    "slug": {
        type: String,
        slug: "title"
    },
    "author": {
        type: mongoose.Types.ObjectId,
        ref: "Author"
    },
    "available": Boolean,
    "isbn": String,
    "pages": Number,
    "publisher": {
        "city": String,
        "date": Date,
        "name": String
    },
    "subjects": [ String, String ],
    "language": String,
    "reviews": [ { 
        "user": {
            type: mongoose.Types.ObjectId, 
            ref: "User"
        }, 
        "text": String },
     ]
});
module.exports = mongoose.model('Book',bookSchema);
