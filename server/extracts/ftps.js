var q = require('q');
var child_process = require('child_process');
var FTPS = require('ftps');
var path = require('path');
var ms2date = require('ms2date');
var fs = require('fs');
var async = require('async')

module.exports = QFTPS;

function QFTPS(options){
	this.ftps = {};
	// var options = {
	// 	host: 'fwind.me', 
	// 	username: 'leeke', 
	// 	password: 'ls62201991', 
	// 	protocol: 'sftp',
	// }
	this.ftps = new FTPS(options)
}


QFTPS.prototype.put = function(localPath,remotePath){
	var self = this;
	var deferred = q.defer();
	var delay = delay || 1500;
	var filename = path.basename(localPath);

	var existsTask = q.nfcall(fs.exists, localPath)

	fs.exists(localPath,function(exists){
		if(!exists){
			deferred.reject(new Error(localPath + ' does not exist'));
			return 0;
		}
		/*----------start task----------*/
		var workingTime = new Date().getTime();
		var status = 'uploading';
		self.ftps.put(localPath,remotePath).exec(function(err,res){
			if(res.error){
				deferred.reject(res.error);
			}else{
				status = 'done';
				workingTime = new Date().getTime() - workingTime;
				var report = {
					status : status,
					time : ms2date(workingTime),
					localPath : localPath,
					remotePath : remotePath,
					filename : filename,
				}
				deferred.resolve(report);
			}
		});




		async.whilst(function () {
			if(status == 'done'){
				return false
			}
			return true;
		},
		function (cb) {
			self.du(remotePath + filename)
			.then(function(size){
				deferred.notify({status:status,size:size})
				cb(null,size);
			})
			.fail(cb)
		},
		function (err) {
			deferred.reject(err);
		});



	});




	return deferred.promise;

}


QFTPS.prototype.du = function(path){
	var deferred = q.defer();

	this.ftps.raw('du -sk ' + path).exec(function(err,res){

		if(res.error){
			deferred.reject(res.error)
		}else{
			var str = res.data.toString();
			var size = str.split('\t')[0];
			deferred.resolve(size*1024)
		}
	})
	return deferred.promise;

}





// var qftps = new QFTPS();


// qftps.put('/Users/leeke/Desktop/test.pdf','~/backup/')
// .then(function(report){
// 	console.log(report)
// })
// .fail(console.error)
// .progress(console.log)


