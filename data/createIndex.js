var Book = require("../models/book");
var User = require("../models/user");
var Author = require("../models/author");
var Review = require("../models/review");
var mongoose = require("mongoose");
var Config = require("../config/config");
var connectionstring =
  "mongodb://" + Config.dbhost + ":" + Config.dbport + "/" + Config.dbname;
mongoose.connect(connectionstring, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log("Creating text index for Books for " + Config.dbname + "/products");

// Book.index({name: 'text',title:'text',description:'text',category:'text'});
// Author.index({name: 'text',title:'text',description:'text',category:'text'});
// User.index({name: 'text',title:'text',description:'text',category:'text'});
