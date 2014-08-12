var thunkify = require('thunkify');
var fs = require('fs');
var merge = require('merge');

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
			service:'gmail',
			username:'leeke.priv',
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

	app.put('/config',function *(){
		var  newConfig = this.post;
		var config = this.config;

		merge(config,newConfig);
		this.body = config;
	})
}



