'use strict';

require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
mongoose.connect('mongodb+srv://coreychang808:volcomer123@cluster0-vlr04.mongodb.net/test?retryWrites=true&w=majority', options);

// Start the web server
require('./src/app.js').start(process.env.PORT);
