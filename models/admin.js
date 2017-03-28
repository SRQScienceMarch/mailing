var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//mongoose Schema
var AdminSchema = new Schema({
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false }
  });

//hash the password before it's saved
AdminSchema.pre('save', function(next){
  var admin = this;

  if (!admin.isModified('password')) return next();

  bcrypt.hash(admin.password, null, null, function(err, hash){
    if (err) return next(err);
    admin.password = hash;
    next();
  });
});

module.exports = mongoose.model('Admin', AdminSchema);
