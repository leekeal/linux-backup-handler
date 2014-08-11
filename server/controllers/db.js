module.exports = function(app){

	var ctrl = '/dbs';

	app.get(ctrl,function *(next){
		var dbs = this.config.databases;
		this.body = {data:dbs}
	})


	/* Add */
	app.post('/db',function *(next){
		var config = this.config;
		var databases = config.databases;
		var id = getMaxIndex(databases) + 1;
		var db = {
			id:id,
			title:'jcys120.com主站',
			host:'localhost',
			name:'leeke_test',
			username:'leeke',
			password:'pw62201991db',
			folder:'./backup/database/',/*最后的文件夹名词后必须加 '/' */
			remote:false,
			remoteFolder:'./backup/database/',
			emailTO:'',
		};
		databases[id] = db;
		try{
			yield this.config.save(config);
			this.body = config;
		}catch(error){
			this.body = error;
		}
		this.body = config
	});

}

function getMaxIndex(obj){
	if(!obj){
		return 0;
	}
	var keys = [];
	for(var key in obj){
		if(obj[key]){
			keys.push(key);
		}
	}

	if(!keys.length){
		return 0;
	}
	keys.sort();
	return parseInt(keys.pop());
}