var express = require('express');
var react = require('react');
var ReactEngine = require('express-react-engine');
var app = express();

app.engine('jsx', ReactEngine());
app.set('views', __dirname + '/../public/components');

var routes = require("./routes.js")(app);
app.use(express.static(__dirname + '/../public'));

module.exports = app;