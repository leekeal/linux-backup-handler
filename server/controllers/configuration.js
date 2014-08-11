var thunkify = require('thunkify');
var fs = require('fs');

module.exports = function(app){


	/* Initialize the system configuration*/
	app.get('/install',function *(next){
		var config = {
			url:'http://127.0.0.1:3000',
			mysqldumpPath : '/Applications/MAMP/Library/bin/mysqldump ',
			databases:{},
			administrator:'test',
			password:'test',
		};
		var email = {
			username:'leeke',
			password:'ls20080813',
			address:'leeke.priv@gmail.com'
		}
		config.email = email;

		var exists = yield this.config.exists();
		if(exists){
			return this.body = {error:'Configuration file already exists'};
		}

		config.installed = true;
		yield this.config.save(config);


		this.body = config;
	});
}



