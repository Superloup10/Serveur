var express = require('express'); //Framework de base
var logger = require('morgan'); //Middleware de log
var favicon = require('serve-favicon'); // Middleware de favicon
var app = express(); //Variable app créé d'après le framework
var http = require('http'); //Module du protocole HTTP
var server = http.createServer(app); // On créé le serveur d'après la variable app
var io = require('socket.io')(server); // Module du temps réel
var fs = require('fs'); // Module de fichier
var fileStreamRotator = require('file-stream-rotator');
var logDirectory = __dirname + '/log';

fs.existsSync(logDirectory) || fs.mkdir(logDirectory);

var accessLogStream = fileStreamRotator.getStream({ // On créé une fichier de log
	date_format: 'YYMMDD',
	filename: logDirectory + '/access-%DATE%.log',
	frequency: 'daily',
	verbose: false
});

var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var ip = '192.168.1.40';
var port = '8080';

var db = require('./admin/bdd/bdd.js');

db.connect('localhost', 'parking', 'parking', 'parking');

var select_request = 'SELECT s.reload, s.bill, s.name, s.firstName, p.number, p.status, p.use_time FROM subscribe s JOIN parking p ON p.number = s.id_subscribe';
var results = null;
var processResources = function(result) {
	for(key in result)
	{
		results = result;
		console.log('Number : ' + result[key].number);
	}
};

db.executeSelectQuery(select_request, processResources);
/*var insert_request = 'INSERT INTO staff SET ?';
var temp = {id: 'NULL', name: req.body.name, firstName: req.body.firstname, function: req.body.fonction, username: req.body.username, password: req.body.password, date: NOW()};*/

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
}).post('/inscription/personnel', urlencodedParser, function(req, res) {
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
	res.render("admin.ejs"); // Rendu de la page Admin
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
	
	socket.on('saveStaff', function(data) {
		console.log('Contenu du message : ' + data);
		socket.emit('saveStaff', 'Bien Reçu');
	});
});

server.listen(port); // Server Started on localhost:8080
