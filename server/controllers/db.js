var merge = require('merge');
var mysqlHandler = require('../extracts/mysqlHandler');
var tarHandler = require('../extracts/tarHandler');

module.exports = function(app){

	var ctrl = '/dbs';

	app.get(ctrl,function *(next){
		var dbs = this.config.databases;
		this.body = dbs;
	})


	/* Add */
	app.post('/db',function *(next){
		var databases = this.config.databases;
		var id = getMaxIndex(databases) + 1;
		var newDb = this.post;
		newDb.id = id;
		if(newDb.id && newDb.title && newDb.host && newDb.name && newDb.username && newDb.password && newDb.folder){
			databases[id] = newDb;
			yield this.config.save();
			this.body = newDb;
		}else{
			this.body = {error:'The data is incomplete'};
		}

	});

	app.put('/db',function *(){
		var id = this.post.id;
		var database = this.config.databases[id];
		var newDatabase = this.post;
		merge(database,newDatabase);
		yield this.config.save()
		this.body = database;
	})

	app.get('/dbs/:id',function *(){
		var id = this.params.id;
		var dbs = this.config.databases;
		if(dbs[id]){
			this.body = dbs[id]
		}else{
			this.body = {status:'wating'};
		}
	})


	app.get('/db-backup/:id',function *(next){
		var self = this;
		var id = this.params.id;
		if(!this.config.databases[id]){
			this.body = 'Database is not exists'
			return;
		}

		var dbConfig = this.config.databases[id];
		dbConfig.mysqldumpPath = this.config.mysqldumpPath

		/* -------------Database export start-------------*/
		var mysqlTask = mysqlHandler.backup(dbConfig,1000)
		this.body = {status:'wating'};

		
		mysqlTask.progress(function(status){
			console.log(status)
			self.socketIo.emit('database',{id:id,status:status})
		});
		
		mysqlTask.fail(function(err){
			console.error(err)
			err.status = 'Error';
			self.socketIo.emit('database',{id:id,status:err})
		});


		mysqlTask.then(function(result){
			console.log(result)
			self.socketIo.emit('database',{id:id,status:result})
		})
		/* ----------- Database export end -------------------*/

		/* --------- compress sql file start  --------------*/
		mysqlTask.then(compressSqlFile);

		function compressSqlFile(result){
			var compressTask = tarHandler(result.path)

			compressTask.fail(function(err){
				console.error(err)
				err.status = 'Error';
				self.socketIo.emit('database',{id:id,status:err})
			});

			compressTask.progress(function(status){
				console.log(status)
				self.socketIo.emit('database',{id:id,status:status})
			});

			compressTask.then(function(result){
				console.log(result)
				self.socketIo.emit('database',{id:id,status:result})
			})
			/* --------- compress sql file start  -------------*/
			if(dbConfig.remote && dbConfig.remote.on){
				compressTask.then(uploadToRemote);
			}else{
				compressTask.then(uploadToRemote);
			}
		}


		function uploadToRemote(result){
			console.log('uploadToRemote')
			self.socketIo.emit('database',{id:id,status:result,end:'true'})
		}

		function sendEmail(result){
			console.log('sendEmail')
		}


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