var express = require('express');
var app = express();
var path    = require('path');
var expressSanitizer = require('express-sanitizer');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); //for working with database
var Admin = require('./models/admin');
var port    = process.env.PORT || 8080; // setting port
var morgan  = require('morgan'); //for logging
var jwt = require('jsonwebtoken');
var mongooseToCsv = require("mongoose-to-csv");

var superSecret = process.env.secret || 'test';

mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSanitizer()); //blocking stored XSS

app.use(morgan('dev'));
//set the public folder to server public assets
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

var adminRouter = express.Router();

adminRouter.get('/authenticate', function(req, res){
  Admin.findOne({
    username: req.body.username
  }).select('username password').exec(function(err, user){
    if(err){
      throw err;
    }
    if (!user){
      res.json({
        success: false,
        message: "Authentication failed. Check your password or contact the administrator."
      });
    } else if (user){
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword){
        res.json({
          success: false,
          message: "Authentication failed. Check your password or contact the administrator."
        })
      } else{
        var token = jwt.sign({
          name: 'srq',
          username: user.username
        }, superSecret, {
          expiresIn: '30m' // Expires in 30 minutes
        });

        res.json({
          success: true,
          message: 'Welcome!',
          token: token
        });
      }
    }
  });
});

adminRouter.use(function(req, res, next){

  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token){
    //verify secret, check expiraton
    jwt.verify(token, superSecret, function(err, decoded){
      if (err){
        return res.status(403).send({
          success: true,
          message: 'Failed to authenticate token.'
        });
      } else{
        //if everything is good, save to use for other routes
        req.decoded = decoded;

        next();
      }
    });
  }else{
    return res.status(403).send({
      success: true,
      message: 'No token provided'
    });
  }
});

adminRouter.get('/list', function(req, res){
  //return the csv here
  res.json({message: 'this will be the csv when it\'s done'});
});
app.listen(port);

app.use('/admin', adminRouter);
