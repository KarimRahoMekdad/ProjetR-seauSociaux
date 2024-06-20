const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: emailRegex,
    lowercase: true,
    minlength: 5, 
    maxlength: 50},
  password: { 
    type: String,
    required: true,
    minlength: 8, 
    maxlength: 128},
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);