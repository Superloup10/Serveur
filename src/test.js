var express = require('express');
// var morgan = require('morgan');
//var favicon = require('serve-favicon');

var app = express();

app/*.use(morgan('combined')).use(express.static(__dirname + '/public')
).use(favicon(__dirname + '/public/favicon.ico'))*/
.get('/', function(req, res) {
	res.render("index.ejs");
}).get('/admin', function(req, res) {
	res.render("admin.ejs");
}).use(function(req, res, next) {
	res.status(404).render("404.ejs");
});
app.listen(8080);
