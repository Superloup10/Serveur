(function() {
  var lastName = document.getElementById('lastName');
  var firstName = document.getElementById('firstname');
  var func = document.getElementById('func');*/
  var username = document.getElementById('user');
  var password = document.getElementById('pass');
  var button = document.getElementById('button');
  var socket = io.connect('http:\/\/192.168.1.87:8080');
  var submitForm = function() {
   socket.emit('registerStaff', {
      'name': lastName.value,
      'firstname': firstName.value,
      'func': func.value,
      'user': username.value,
      'pass': password.value
    });*/
    
   /* socket.emit('connectionStaff', {
    	'user': username.value,
    	'pass': password.value
    });
    
    socket.on('errorConnectionStaff', function(message) {
      switch(message) {
    	case 0:
    	  alert('Vous avez bien été enregistré !');
    	  form.action = '/admin/connection';
    	  form.submit();
    	  break;
    	case 1:
    	  alert('Merci de saisir tous les champs');
    	  break;
    	case 2:
    	  alert('Le pseudo/le mot de passe sont invalides ou n\'existent pas');
    	  break;
    	case 3:
    	  alert('');
    	  break;
      }
    });*/
    
    socket.on('errorRegisterStaff', function(message) {
      switch (message) {
        case 0:
          alert('Vous avez bien été inscrit !');
          form.action = '/inscription/personnel';
          form.submit();
          break;
        case 1:
          alert('Merci de saisir tous les champs');
          break;
        case 2:
          alert('Le pseudo ' + username.value + ' est déjà enregistré.\nMerci de changer votre pseudo !');
          break;
        case 3:
          alert('Merci de créer un mot de passe d\'au moins six caractères');
          break;
      }
    });
  };
  button.addEventListener('click', submitForm);
}) ()
