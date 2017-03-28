var express = require('express');
var app = express();
var path    = require('path');
var expressSanitizer = require('express-sanitizer');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); //for working with database
var Admin = require('./models/admin');
var port    = process.env.PORT || 8080 // setting port
var morgan  = require('morgan'); //for logging

mongoose.connect(process.env.MONGODB_URI);
