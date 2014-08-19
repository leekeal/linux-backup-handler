var merge = require('merge');
var tarHandler = require('../extracts/tarHandler');
var q = require('q');
var path = require('path');
var dateFormat = require('dateformat');
var generalTask = require('../extracts/generalTask');
module.exports = function(app){

	app.post('/folder',function *(next){
		var folders = this.config.folders;
		var newFolder = this.post;
		var id = getMaxIndex(folders) + 1;
		newFolder.id = id;

		if(newFolder.title && newFolder.folder){
			folders[id] = newFolder;
			yield this.config.save()
			this.body = newFolder;
		}
		else{
			this.body = {error:'The data is incomplete'};
		}


	})

	/**
	*get database info
	*/
	app.get('/folders/:id',function *(){
		var id = this.params.id;
		var folders = this.config.folders;
		if(folders[id]){
			this.body = folders[id]
		}else{
			this.body = {error:'Not exists'};
		}
	});

	app.get('/folders',function *(next){
		var folders = this.config.folders;
		this.body = folders;
	})

	app.put('/folder',function *(){
		var id = this.post.id;
		var folder = this.config.folders[id];
		var newFolder = this.post;
		merge(folder,newFolder);
		yield this.config.save()
		this.body = folder;
	})

	app.get('/folder-backup/:id', function *(){
		var ctx = this;
		var id = this.params.id;
		if(!this.config.folders[id]){
			this.body = 'Folder is not exists'
			return;
		}
		var folderConfig = this.config.folders[id];
		this.body = {status:'wating'};

		/* start to backup*/
		var report = {};
		q.fcall(compressFolder)
		.then(function(compressReport){
			report.compress = compressReport;
			return generalTask.uploadAndEmail(ctx.config,folderConfig,report,nofityStatus);
			
		})
		.then(function(){
			console.log(report)
			ctx.io.sockets.emit('folder',{id:id,status:'done',end:true,report:report})
		})
		.catch(function(err){
			console.error(err)
			err.status = 'Error';
			ctx.io.sockets.emit('folder',{id:id,status:err})
		})



		function compressFolder(){
			var time = dateFormat(new Date(), "yyyymmdd-HHMMss");
			var fileName = path.basename(folderConfig.folder) + '-' + time + '.tar';
			var targetPath = path.join(folderConfig.local,fileName);
			var compressTask = tarHandler(folderConfig.folder,
			{
				target:targetPath ,
				args:'cf',
				delay:500,
			});
			compressTask.progress(nofityStatus);
			return compressTask;
		}

		function nofityStatus(status){
			console.log(status)
			ctx.io.sockets.emit('folder',{id:id,status:status})
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