var http = require('http');

var server = http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type":"text/html"});
	res.end('<p>Bienvenue sur le <strong>serveur</strong>, ceci est une page de test</p>');
});
server.listen(8080);
