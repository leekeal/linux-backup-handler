var merge = require('merge');
var mysqlHandler = require('../extracts/mysqlHandler');
var tarHandler = require('../extracts/tarHandler');
var fs = require('fs');
var q = require('q');
var QFTPS = require('../extracts/ftps');
var Mail = require('../extracts/mail');

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
			if(dbConfig.remote.on){
				return uploadToRemote()
			}
		})
		.then(function(uploadReport){
			report.upload = uploadReport
			return sendEmail();
		})
		.then(function(mailRes){
			console.log(mailRes)
		})
		.catch(function(err){
			console.error(err)
			err.status = 'Error';
			ctx.io.sockets.emit('database',{id:id,status:err})
		})
		.done();

		/*-----------------------------*/


		function exportSql(){
			var mysqlTask = mysqlHandler.backup(dbConfig,1000)
			mysqlTask.progress(nofityStatus);
			return mysqlTask;
		}

		

		function compressSql(exportResult){
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



		function uploadToRemote(){
			console.log('uploadToRemote')
			var remoteConfig = ctx.config.remote;
			var qftps = new QFTPS(remoteConfig);
			var uploadTask = qftps.put(report.compress.fileName,dbConfig.remote.folder);
			uploadTask.progress(function(status){
				ctx.io.sockets.emit('database',{id:id,status:status})
			})
			return uploadTask;
		}

		function sendEmail(){
			if(!dbConfig.emailTo){
				console.log('Email notification function did not open it');
				return 0;
			}

			var mail = new Mail(ctx.config.email);
			var options = {
				from:'Linux backup handler',
				to:dbConfig.emailTo,
				subject:'Database backup report',
				text:'text'
			}
			return mail.send(options)
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