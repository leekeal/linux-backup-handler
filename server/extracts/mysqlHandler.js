var async = require('async');
var dateFormat = require('dateformat');
var ms2date = require('ms2date');
var Q = require('q');
var child_process = require('child_process');
var exec = Q.denodeify(child_process.exec);


var fs = require('fs');




exports.backup = function(dbCongfig,delay){
	var delay = delay || 1000;
	var deferred = Q.defer();
	var time = dateFormat(new Date(), "yyyymmdd-HHMMss");
	var fileName = dbCongfig.name + '-' + time + '.sql'
	var path = dbCongfig.folder + fileName;
	var command = ' -u'+dbCongfig.username+ ' -p'+dbCongfig.password+'  '+dbCongfig.name+'  > ' + path;
	var time; 



	time = new Date().getTime();
	var exportSql = exec(dbCongfig.mysqldumpPath+' '+command);

	var status = 'exporting';
	/* Monitoring the file size change every other delay*/
	var exportMonitor = setInterval(function(){
		fs.stat(path,function(err,stats){
			if(err){
				deferred.reject(err);
				clearInterval(exportMonitor);
			}
			else if(status == 'done'){
				deferred.notify({status:'done'});
				clearInterval(exportMonitor);
			}
			else{
				var size = stats.size;
				deferred.notify({status:status,size:size});
			}
		})
	},delay);


	exportSql.then(function(results){
		status = 'done';
		time = new Date().getTime() - time;
		var size = fs.statSync(path).size;
		var results = {
			status:status,
			time:ms2date(time),
			fileName:fileName,
			path:path,
			size:size,
		}
		deferred.resolve(results);
	});

	exportSql.fail(deferred.reject)

	return deferred.promise;
}