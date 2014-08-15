var q = require('q');
var QFTPS = require('../extracts/ftps');
var Mail = require('../extracts/mail');

exports.uploadAndEmail = function(config,taskConfig,taskReport,nofityStatus){
	var deferred = q.defer();

	q.fcall(function(){
		if(taskConfig.remote.on){
			var uploadTaks = uploadToRemote(config.remote,taskConfig,taskReport);
			uploadTaks.progress(nofityStatus)
			return uploadTaks;
		}
	})
	.then(function(uploadReport){
		if(uploadReport){
			taskReport.upload = uploadReport; /* add upload report to taskReport*/
		}
		if(taskConfig.emailTo){
			return sendEmail(config.email,taskConfig,taskReport);
		}
	})
	.then(function(emailReport){
		console.log(emailReport)
		deferred.resolve(emailReport);
	})
	.catch(function(err){
		deferred.reject(err);
	})
	.done()

	return deferred.promise;
}





function uploadToRemote(remoteConfig,taskConfig,taskReport){
	var qftps = new QFTPS(remoteConfig);
	var uploadTask = qftps.put(taskReport.compress.filePath,taskConfig.remote.folder);
	return uploadTask;
}

function sendEmail(emailConfig,taskConfig,taskReport){
	if(!taskConfig.emailTo){
		console.log('Email notification function did not open it');
		return 0;
	}
	var report = reportHandler(taskReport);
	var mail = new Mail(emailConfig);
	var options = {
		from:'Linux backup handler',
		to:taskConfig.emailTo,
		subject:taskConfig.title + ' backup report',
		text:report
	}
	return mail.send(options)
}

function reportHandler(report){
	var text = '';
	for(task in report){
		var taksText = '\n---------------';
		taksText += task;
		taksText += '---------------\n'
		for(key in report[task]){
			var item = report[task][key]
			taksText += key + ': ' + item +'\n'
		}
		text += taksText;
	}
	return text;
}