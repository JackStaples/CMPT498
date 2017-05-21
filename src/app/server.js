var express = require('express');
var react = require('react');

var app = express();

app.set('view engine', 'jsx');
app.set('views', __dirname + '/../public/views');

app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res){
  res.render((__dirname + '/../public/views/home.jsx'));
});

module.exports = app;