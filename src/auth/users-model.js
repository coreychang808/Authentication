'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');


const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});

//this next is mongoose next
users.pre('save', function(next) {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(this.password, SALT_ROUNDS)
    .then(hashedPassword =>{
      this.password = hashedPassword;
      next();
    })
});

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => {
      return user ? user.comparePassword(auth.password) : false;
      })
    .catch(console.error);
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNjQ2NTcwZTMwMjNjMTI2YTk2NDI0NCIsImNhcGFiaWxpdGllcyI6W10sImlhdCI6MTU2Njg2MDY1Nn0.j6d4dR2JMD7OPo7W-VjZJOWfjye2wPh4mnr-W79-hCs
};

// Compare a plain text password against the hashed one we have saved
users.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
  .then(isPasswordValid => isPasswordValid? this : null);
};

// Generate a JWT from the user id and a secret
users.methods.generateToken = function() {
  const tokenData = {
    id:this._id,
    capabilities: [],
  };
  return jsonWebToken.sign(tokenData, process.env.SECRET || 'testPassword' );
  //sign makes the token 
};

module.exports = mongoose.model('users', users);
