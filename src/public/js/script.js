var name;
var firstName;
var fonction;
var username;
var password;
var submit;
var form = document.getElementById("form");

var socket = io.connect('http://<%= ip %>:<%= port %>');

var submitForm = function() {
	console.log('Bien envoyé');
	socket.emit('saveStaff', {
		'name' : name.value,
		'firstname' : firstName.value,
		'func' : fonction.value,
		'user' : username.value,
		'pass' : password.value
	});
};

form.addEventListener("load", function() {
	name = document.getElementbyId("name");
	firstName = document.getElementbyId("firstname");
	fonction = document.getElementbyId("func");
	username = document.getElementbyId("user");
	password = document.getElementbyId("pass");
	submit = document.getElementbyId("submitData");
	submit.addEventListener("click", submitForm);
});

socket.on('message', function(message) {
	alert('Le serveur a un message pour vous : ' + message);
});

socket.on('saveStaff', function(message) {
	alert('Vous avez bien été enregistrer');
});