var express = require('express'); //Framework de base
// var morgan = require('morgan'); //Middleware de log
//var favicon = require('serve-favicon'); // Middleware de favicon

var app = express();

app/*.use(morgan('combined')
).use(express.static(__dirname + '/public')
).use(favicon(__dirname + '/public/favicon.ico'))*/
.get('/', function(req, res) { // Main page
	res.render("index.ejs"); // Render Main page
}).get('/admin', function(req, res) { // Admin page
	res.render("admin.ejs"); // Render Admin page
}).get('/admin/status', function(req, res) { // Status page
	var num = ["0", "1", "2", "3", "4", "5", "6", "7"]; // Place of parking Number
	var occuper = ["occuper", "non occuper"]; // Place of parking Status
	res.render("status.ejs", {num: num, occuper: occuper}); // Render Status page and send params temp
}).use(function(req, res, next) { // 404 Page
	res.status(404).render("404.ejs"); // Render 404 page and send status 404
});

var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
	fs.readFile('./index.html', 'utf-8', function(error, content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

var io = require('socket.io')(server);
io.on('connection',function(socket) {
	socket.emit('message', 'Vous êtes bien connecté !');
});

server.listen(8080); // Server Started on localhost:8080
