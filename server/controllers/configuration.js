var thunkify = require('thunkify');
var fs = require('fs');
var merge = require('merge');

module.exports = function(app){


	/* Initialize the system configuration*/
	app.post('/install',function *(next){
		var exists = yield this.config.exists();
		if(exists){
				   // this.status = 500;
			return this.body = {installed:'Configuration file already exists',error:'Configuration file already exists'};
		}

		var newConfig = this.post;
		if(newConfig.url && newConfig.mysqldumpPath && newConfig.administrator && newConfig.password){
			
			merge(this.config,newConfig);/*合并配置文件对象*/
			this.config.installed = true;
			yield this.config.save();
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



