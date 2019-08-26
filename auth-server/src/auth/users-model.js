'use strict';

const mongoose = require('mongoose');
// bcrypt
// jwt

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
  //   .catch(error => {throw error})
  // bcrypt.hash(this.password,10)
  //   .then(hashedPassword => {
  //     this.password = hashedPassword;
  //     next();
  //   })
  //   .catch( error => {throw error;} );
});

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => {
      if(user){
        return user.comparePassword(auth.password);
      }else{
        return false;
      }
    })
    .catch(console.error);
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
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  return jwt.sign(tokenData, process.env.SECRET || 'testPassword' );
  //sign makes the token 
};

module.exports = mongoose.model('users', users);
