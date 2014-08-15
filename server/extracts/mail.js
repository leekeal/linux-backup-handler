var nodemailer = require('nodemailer');
module.exports = Mail;
var q = require('q');
function Mail(options){
	this.transporter= nodemailer.createTransport({
		service: options.service,
		auth: {
			user: options.address,
			pass: options.password
		}
	});
}

Mail.prototype.send = function(options){
	var deferred = q.defer();
	this.transporter.sendMail(options,function(err,info){
		if(err){
			console.error(err)
			deferred.reject(err);
		}
		else{
			deferred.resolve(info);
		}
	})
	return deferred.promise;
}