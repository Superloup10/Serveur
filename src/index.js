var express = require('express'); //Framework de base
var morgan = require('morgan'); //Middleware de log
var favicon = require('serve-favicon'); // Middleware de favicon
var app = express(); //Variable app créé d'après le framework
var http = require('http'); //Module du protocole HTTP
var server = http.createServer(app); // On créait le serveur d'après la variable app
var io = require('socket.io')(server); // Module du temps réel

app.use(morgan('combined') // On utilise un logger
).use(express.static(__dirname + '/img') // Dossier où se trouve les images
).use(favicon(__dirname + '/img/favicon.ico') // Lien vers le favicon
).get('/', function(req, res) { // Page principale
	res.render("index.ejs"); // Rendu de la page principale
}).get('/admin', function(req, res) { // Page Admin
	res.render("admin.ejs"); // Rendu de la page Admin
}).get('/admin/status', function(req, res) { // Page status
	var num = ["0", "1", "2", "3", "4", "5", "6", "7"]; // Numéro de la place de parking
	var occuper = ["occuper", "non occuper"]; // Status de la place de parking
	res.render("status.ejs", {num: num, occuper: occuper}); // Rendu de la page status et envoit de données temporaires
}).use(function(req, res, next) { // Page 404
	res.status(404).render("404.ejs"); // Rendu de la page 404 et envoit du status 404
});

io.on('connection',function(socket) { // Event connection au serveur
	socket.emit('message', 'Vous êtes bien connecté !'); // On indique au client qu'il est bien connecté
	
	socket.on('message', function(message) { // On attend un message du client
		console.log('Un client me parle ! Il me dit : ' + message); // Le client a envoyé un message
		socket.emit('message', 'Oui, ça va, mais arrête de m\'embêter'); // On envoit un message au client
	});
});

server.listen(8080); // Server Started on localhost:8080
