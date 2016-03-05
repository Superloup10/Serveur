var http = require('http');
var url = require('url');
var querystring = require('querystring');
var express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.end('<p>Bienvenue sur le <strong>serveur</strong>, ceci est la page d\'accueil</p>');
}).get('/admin', function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.end('<p>Voici la page d\'administration !</p>');
}).use(function(req, res, next) {
	res.setHeader('Content-Type', 'text/html');
	res.status(404).send('<h1>Erreur 404\:</h1><p>La page que vous avez demandé n\'existe pas.</p>');
});
app.listen(8080);



/*var server = http.createServer(function(req, res) {
	var page = url.parse(req.url).pathname;
	var params = querystring.parse(url.parse(req.url).query);
	console.log('Page \: ' + page);
	console.log('Params \: ' + params + '\n');
	res.writeHead(200, {"Content-Type":"text/html"});
	if(page == '/') {
		res.write('<p>Bienvenue sur le <strong>serveur</strong>, ceci est la page d\'accueil</p>');
	}
	else if(page == '/admin') {
		res.write('<p>Voici la page d\'administration !</p>');
	}
	else {
		res.writeHead(404, {"Content-Type":"text/html"});
		res.write('<h1>Erreur 404\:</h1><p>La page que vous avez demandé n\'existe pas.</p>');
	}
	res.end();
});
server.listen(8080);
*/
