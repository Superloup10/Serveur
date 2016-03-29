db = { 
	mysql : require('myql'),
	mySqlClient : null,
	
	connect : function(host, usern password, database) {
	this.mysql = require('mysql');
	
	this.mySqlClient = this.mysql.createConnection( {
		host : host,
		user : user,
		password : password,
		database : database
	});
},
	
	var selectQuery = 'SELECT * FROM parking';

	mySqlClient.query(selectQuery, function select(error, results, fields) {
		if(err)
		{
			console.log(error);
			mySqlClient.end();
			return;
		}
	
		if(results.length > 0)
		{
			var firstResult = results[0];
			console.log('id: ' + firstResult['id']);
			console.log('number: ' + firstResult['number']);
			console.log('status: ' + firstResult['status']);
			console.log('use_time: ' + firstResult['use_time']);
			console.log('use_number: ' + firstResult['use_number']);
		}
		else
		{
			console.log('Pas de données');
		}
		mySqlClient.end();
		// console.log('The solution is: ', rows[0].solution);
	});
};
