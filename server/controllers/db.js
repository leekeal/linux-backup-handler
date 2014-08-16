var merge = require('merge');
var mysqlHandler = require('../extracts/mysqlHandler');
var tarHandler = require('../extracts/tarHandler');
var fs = require('fs');
var q = require('q');
var Mail = require('../extracts/mail');
var generalTask = require('../extracts/generalTask');
module.exports = function(app){

	var ctrl = '/dbs';

	app.get(ctrl,function *(next){
		var dbs = this.config.databases;
		this.body = dbs;
	})


	/**
	*Add database
	*/
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
	/**
	*edit database
	*/
	app.put('/db',function *(){
		var id = this.post.id;
		var database = this.config.databases[id];
		var newDatabase = this.post;
		merge(database,newDatabase);
		yield this.config.save()
		this.body = database;
	})
	/**
	*get database info
	*/
	app.get('/dbs/:id',function *(){
		var id = this.params.id;
		var dbs = this.config.databases;
		if(dbs[id]){
			this.body = dbs[id]
		}else{
			this.body = {error:'Not exists'};
		}
	});
	/* *
	*backup database
	*/
	app.get('/db-backup/:id',function *(next){
		var ctx = this;
		var id = this.params.id;
		if(!this.config.databases[id]){
			this.body = 'Database is not exists'
			return;
		}

		var dbConfig = this.config.databases[id];
		dbConfig.mysqldumpPath = this.config.mysqldumpPath
		this.body = {status:'wating'}

		/* start to backup*/
		var report = {};
		q.fcall(exportSql)/*Export mysql to sql*/
		.then(compressSql)/*compress sql to tar.gz*/
		.then(deleteSqlFile)
		.then(function(){
			return generalTask.uploadAndEmail(ctx.config,dbConfig,report,nofityStatus);
		})
		.then(function(){
			console.log(report)
			ctx.io.sockets.emit('database',{id:id,status:'done',end:true,report:report})
		})
		.catch(function(err){
			console.error(err)
			err.status = 'Error';
			ctx.io.sockets.emit('database',{id:id,status:err})
		})
		.done();

		/*-----------------------------*/


		function exportSql(){
			console.log('export sql start')
			var mysqlTask = mysqlHandler.backup(dbConfig,1000)
			mysqlTask.progress(nofityStatus);
			return mysqlTask;
		}

		

		function compressSql(exportResult){
			console.log('compressSql start')
			report.export = exportResult;
			var compressTask = tarHandler(report.export.path)
			compressTask.progress(nofityStatus);
			return compressTask;
		}

		function deleteSqlFile(compressResult){
			report.compress = compressResult;
			var status = {status:'deleteSqlFile'};
			nofityStatus(status);
			return q.nfcall(fs.unlink, compressResult.originFile);
		}


		function nofityStatus(status){
			console.log(status)
			ctx.io.sockets.emit('database',{id:id,status:status})
		}

	})


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