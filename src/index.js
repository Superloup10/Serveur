var express = require('express'); //Framework de base
var logger = require('morgan'); //Middleware de log
var favicon = require('serve-favicon'); // Middleware de favicon
var app = express(); //Variable app créé d'après le framework
var http = require('http'); //Module du protocole HTTP
var server = http.createServer(app); // On créé le serveur d'après la variable app
var io = require('socket.io')(server); // Module du temps réel
var fs = require('fs'); // Module de fichier
var crypto = require('crypto');
var fileStreamRotator = require('file-stream-rotator');
var logDirectory = '../log';

fs.existsSync(logDirectory) || fs.mkdir(logDirectory);

var accessLogStream = fileStreamRotator.getStream({ // On créé une fichier de log
	date_format: 'YYMMDD',
	filename: logDirectory + '/access-%DATE%.log',
	frequency: 'daily',
	verbose: false
});

var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });

var ip = '192.168.1.87';
var port = '8080';
var db = require('./admin/bdd/bdd.js');

db.connect('localhost', 'parking', 'parking', 'parking');
var select_request = 'SELECT s.reload, s.bill, s.name, s.firstName, p.number, p.status, p.use_time FROM subscribe s JOIN parking p ON p.number = s.id_subscribe';
var results = null;
var processResources = function(result) {
	for(key in result)
	{
		results = result;
	}
};

db.executeSelectQuery(select_request, processResources);

var pass = function(pass) {
	return crypto.pbkdf2Sync(pass, 'CeciestunessaidechiffrementparleprotocolePBKDF2Sync', 2500, 512, 'sha512').toString('hex');
}

app.use(logger('dev', // On utilise un logger
{ stream : accessLogStream } // On enregistre les logs dans un fichier
)).use(express.static(__dirname + '/public') // Dossier où se trouve les images
).use(favicon(__dirname + '/public/favicon.ico') // Lien vers le favicon
).use(session({ secret : 'secret' })
).use(function(req, res, next) {
	if (typeof (req.session.register) == 'undefined') {
		req.session.register = [];
	}
	next();
}).get('/', function(req, res) { // Page principale
	res.render("index.ejs", { ip : ip, port : port }); // Rendu de la page principale
}).get('/inscription', function(req, res) { // Page d'inscription
	res.render("inscription.ejs", { ip : ip, port : port }); // Rendu de la page d'inscription
}).post('/inscription/personnel', urlEncodedParser, function(req, res) {
		if(req.body.name != '' || req.body.firstname != '' || req.body.username != '' || req.body.password != '' || req.body.fonction != '') {
			req.session.register.push(req.body.name);
			req.session.register.push(req.body.firstname);
			req.session.register.push(req.body.username);
			req.session.register.push(req.body.password);
			req.session.register.push(req.body.fonction);
		}
		//console.log(req.session.register);
		res.redirect('/inscription');
}).get('/admin', function(req, res) { // Page Admin
	res.render("admin.ejs", {ip :ip, port : port}); // Rendu de la page Admin
}).post('/admin/connection', urlEncodedParser, function(req, res) {
	res.redirect('/admin/status');
}).get('/admin/status', function(req, res) { // Page status
	res.render("status.ejs", { result : results }); // Rendu de la page status et envoit de données temporaires
}).use(function(req, res, next) { // Page 404
	res.status(404).render("404.ejs"); // Rendu de la page 404 et envoit du status 404
});

io.on('connection', function(socket) { // Event connection au serveur
	socket.emit('message', 'Vous êtes bien connecté !'); // On indique au client qu'il est bien connecté

	socket.on('message', function(message) { // On attend un message du client
		console.log('Un client me parle ! Il me dit : ' + message); // Le client  a envoyé un message
		socket.emit('message', 'Oui, ça va, mais arrête de m\'embêter'); // On envoit un  message au client
	});
	
	socket.on('registerStaff', function(data) {
		console.log('Pseudo : ' + data.user);
		console.log('Pass : ' + data.pass);
		db.connect('localhost', 'parking', 'parking', 'parking');
		var empty = function empty(object) {
			for(var i in object)
				if(object.hasOwnProperty(i))
					return false;
			return true;
		};
		
		var select_request = "SELECT name, firstName, function, username FROM staff WHERE username='" + data.user + "'";
		var insert_request = "INSERT INTO staff(name, firstName, function, username, password, date) VALUES('" + data.name + "','"  + data.firstname + "','"  + data.func + "','" + data.user + "','" + pass(data.pass) + "', NOW())";
		
		var registerStaff = function(results, data) {
			if(data.name == '' || data.fistname == '' || data.func == '' || data.user == '' || data.pass == '') {
				socket.emit('errorRegisterStaff', 1);
			}
			else if(empty(results)) {
				if(data.pass.length >= 6) {
					db.executeInsertQuery(insert_request);
					console.log(pass(data.pass));
					socket.emit('errorRegisterStaff', 0);
				}
				else {
					socket.emit('errorRegisterStaff', 3);
				}
			}
			else {
				socket.emit('errorRegisterStaff', 2);
			}
		};
		
		db.executeSelectQuery(select_request, registerStaff, data);
	});
	
	socket.on('connectionStaff', function(data) {
		console.log('Pseudo : ' + data.user);
		db.connect('localhost', 'parking', 'parking', 'parking');
		var empty = function empty(object) {
			for(var i in object)
				if(object.hasOwnProperty(i))
					return false;
			return true;
		};
		
		var select_request = "SELECT username, password FROM staff WHERE username='" + data.user + "'";
		
		var connectionStaff = function(results, data) {
			if(data.user == '' || data.pass == '') {
				socket.emit('errorConnectionStaff', 1);
			}
			else if(empty(results)) {
				console.log(pass(data.pass));
				socket.emit('errorConnectionStaff' , 0);
			}
			else {
				socket.emit('errorConnectionStaff', 2);
			}
		};
		
		db.executeSelectQuery(select_request, connectionStaff, data);
	});
});

server.listen(port); // Server Started on localhost:8080
