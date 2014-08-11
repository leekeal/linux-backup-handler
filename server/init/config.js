var jf = require('jsonfile')
var fs = require('fs-extra');
var configPath = './server/config.json';


/* configuration handler*/
module.exports = function(app){
	app.use(function *(next){
		var error = null;
		var config = yield readConfig();
		config = config || {};
		config.save = saveConfig;
		config.read = readConfig;
		config.exists = function(){
			return function(cb){
				fs.exists(configPath,function(result){
					cb(null,result);
				});
			}
		}

		function saveConfig(config){
			return function(cb){

				jf.writeFile(configPath,config,cb)

				jf.writeFile(configPath,config,function(err){
					if(err){
						error = err;
					}
					cb(null,null);
				})

			}
		}
		function readConfig(){
			return function(cb){
				jf.readFile(configPath,function(err,result){
					if(err){
						error = err;
						cb(null,null);
					}
					else{
						cb(null,result)
					}
				});
			}
		}

		this.config = config;
		yield next;
		/*Unified handling errors*/
		if(error){
			console.error(error);
			/*系统初始页面，不统一响应错误信息，返回初始化结果*/
			if(this.path = '/init'){
				return;
			}

			if(error.code == 'ENOENT'){
				this.body = {
					error:'Configuration file does not exist or app is not installed.',
					type:'NotInstalled'
				}
			}else{
				this.body = {error:error};
			}
		}
	})
}