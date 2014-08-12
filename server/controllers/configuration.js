var thunkify = require('thunkify');
var fs = require('fs');
var merge = require('merge');

module.exports = function(app){


	/* Initialize the system configuration*/
	app.post('/install',function *(next){		
		var exists = yield this.config.exists();
		if(exists){
				   this.status = 500;
			return this.body = {installed:'Configuration file already exists'};
		}

		var post = this.post;
		if(post.url && post.mysqldumpPath && post.administrator && post.password){
			this.config.installed = true;
			yield this.config.save(post);
			this.body = this.config;
		}else{
			this.body = {error:'The data is incomplete'};
		}
	});

	app.put('/config',function *(){
		var  newConfig = this.post;

		merge(this.config,newConfig);
		yield this.config.save()
		this.body = this.config;
	})

	app.get('/config',function *(){
		this.body = this.config;
	})
}



