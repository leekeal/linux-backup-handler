var QFTPS = require('../extracts/ftps');

exports.uploadAndEmail = function(){
	console.log('uploadAndEmail')
}



function uploadToRemote(){
	var remoteConfig = ctx.config.remote;
	console.log('uploadToRemote')
	var qftps = new QFTPS(remoteConfig);
	var uploadTask = qftps.put(report.compress.fileName,dbConfig.remote.folder);
	uploadTask.progress(function(status){
		console.log(status);
		ctx.io.sockets.emit('database',{id:id,status:status})
	})
	return uploadTask;
}

function sendEmail(result){
	console.log('sendEmail')
}