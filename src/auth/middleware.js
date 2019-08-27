'use strict';

const User = require('./users-model.js');

module.exports = (request, response, next) => {
  console.log(request.headers);
  try {

    let [authType, encodedString] = request.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        return _authError();
    }

  } catch(e) {
    return _authError();
  }

  function _authBasic(authString) {
    let decodedString = Buffer.from(authString,'base64').toString(); // <Buffer 01 02...>
    // let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = decodedString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  function _authenticate(user) {
    if ( user ) {
      request.user = user;
      request.token = user.generateToken();
      next();
    }
    else {
      return _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};
