var jf = require('jsonfile')
var fs = require('fs-extra');
var co = require('co');
var merge = require('merge')
var configPath = './server/config.json';


var config = {};
/* configuration handler*/
module.exports = function(app){

	try{
		config =  readConfigSync();
		config.installed = true;
	}catch(err){
		config.installed = false;
	}

	config.save = saveConfig;
	config.read = readConfigSync;
	config.exists = exists;

	app.config = config;/* Set the config into app*/

	app.use(function *(next){
	
		this.config = config;/*Set the config into context*/


		if(!config.installed){
			if(this.path == '/install'){
				yield next
			}else{
				this.body = {install:'Configuration file does not exist or app is not installed.'}
			}
		}else{
			yield next;
		} 
	}) 


}



function exists(){
	return function(cb){
		fs.exists(configPath,function(result){
			cb(null,result);
		});
	}
}

function saveConfig(newConfig){
	return function(cb){
		jf.writeFile(configPath,newConfig,function(err){
			if(err){
				cb(err,null);
			}
			else{
				merge(config,newConfig);/*合并新的config到原始config对象中*/
				cb(null,true);
			}
		})

	}
}


function readConfigSync(){
	return jf.readFileSync(configPath);
}