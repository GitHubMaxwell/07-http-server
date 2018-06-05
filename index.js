'use strict';
var cowsay = require('cowsay');

// 3rd Party Library
const dotenv = require('dotenv').config();

// Local Library / http server
const server = require('./src/app.js');

// Fire up the server, on the port that we pulled out of our .env file
// Note that there is NO default port given!
server.start( process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));