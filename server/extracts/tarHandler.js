var async = require('async');
var dateFormat = require('dateformat');
var ms2date = require('ms2date');
var Q = require('q');
var child_process = require('child_process');
var exec = Q.denodeify(child_process.exec);


var fs = require('fs');



function tar(origin,options){
	var options = options || {}
	var target = options.target || origin + '.tar.gz'
	var args = options.args || 'czf';
	var delay = options.delay || 1000;
	var deferred = Q.defer();
	
	var command = 'tar -' +args + ' ' + target + ' ' + origin;

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
			originFile:origin,
			fileName:target,
			size:size,
		}
		deferred.resolve(results);
	});

	tarProcess.fail(deferred.reject)

	return deferred.promise;
}


module.exports = tar;