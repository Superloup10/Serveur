db = module.exports = { 
	mysql : require('mysql'),
	mySqlClient : null,
	
	connect : function(host, user, password, database) {
		this.mysql = require('mysql');
		
		this.mySqlClient = this.mysql.createConnection( {
			multipleStatements: true,
			host : host,
			user : user,
			password : password,
			database : database,
			charset : 'utf8'
		});
	},

	close : function() {
		this.mySqlClient.end();
	},

	executeSelectQuery : function(selectQuery, callbackResultFunction) {
		this.mySqlClient.query(selectQuery, function(error, results, fields) {
			if(error)
			{
				db.close();
				return error;
			}
		
			if(results.length > 0)
			{
				callbackResultFunction(results);
			}
			else
			{
				console.log('Pas de données');
			}
			db.close();
		});
	},

	executeInsertFunction : function(insertQuery) {
		this.mySqlClient.query(insertQuery , function(error, info) {
			if(error)
			{
				db.close();
				return error;
			}
			
			return info.insertId;
		});
	},

	executeUpdateQuery : function(updateQuery) {
		this.mySqlClient.query(updateQuery, function(error) {
		    if (error)
		    {
		        db.close();
		        return error;
		    }
		    return;
		});
	}
};