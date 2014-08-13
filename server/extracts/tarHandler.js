var async = require('async');
var dateFormat = require('dateformat');
var ms2date = require('ms2date');
var Q = require('q');
var child_process = require('child_process');
var exec = Q.denodeify(child_process.exec);


var fs = require('fs');



function tar(origin,target,config,delay){
	var target = target || origin + '.tar.gz'
	var config = config || 'cvzf';
	var delay = delay || 1000;
	var deferred = Q.defer();
	
	var command = 'tar -' +config + ' ' + target + ' ' + origin;

	time = new Date().getTime();
	var tarProcess = exec(command);

	
	var status = 'compressing';
	/* Monitoring the file size change every other delay*/
	var tarMonitor = setInterval(function(){
		fs.stat(target,function(err,stats){
			if(err || status == 'done'){
				deferred.notify({status:'done'});
				clearInterval(tarMonitor);
			}else{
				var size = stats.size;
				deferred.notify({status:status,size:size});
			}
		})
	},delay);


	tarProcess.then(function(results){
		status = 'done';
		time = new Date().getTime() - time;
		var size = fs.statSync(target).size;
		var results = {
			status:status,
			time:ms2date(time),
			fileName:target,
			size:size,
		}
		deferred.resolve(results);
	});

	tarProcess.fail(deferred.reject)

	return deferred.promise;
}


module.exports = tar;