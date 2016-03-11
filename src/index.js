var express = require('express'); //Framework de base
// var morgan = require('morgan'); //Middleware de log
//var favicon = require('serve-favicon'); // Middleware de favicon
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

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

io.on('connection',function(socket) { // Event connection au serveur
	socket.emit('message', 'Vous êtes bien connecté !'); // On indique au client qu'il est bien connecté
	
	socket.on('message', function(message) { // On attend un message du client
		console.log('Un client me parle ! Il me dit : ' + message); // Le client a envoyé un message
		socket.emit('message', 'Oui, ça va, mais arrête de m\'embêter'); // On envoit un message au client
	});
});

server.listen(8080); // Server Started on localhost:8080
