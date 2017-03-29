var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var mongooseToCsv = require("mongoose-to-csv");


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

AdminSchema.methods.comparePassword = function(password){
  var user = this;
  return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('Admin', AdminSchema);
