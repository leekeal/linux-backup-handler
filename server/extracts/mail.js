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







	// function sendMail(to,subject,text,cb){
	// 	transporter.sendMail({
	// 		from: email.address,
	// 		to: to,
	// 		subject: subject,
	// 		text: text
	// 	},function(err,info){
	// 		console.log(info)
	// 		if(cb){
	// 			cb(err,info)
	// 		}
	// 	});
	// }
	// app.use(function *(next){
	// 	this.sendMail = sendMail;/*set the email handler into the context*/
	// 	yield next;
	// })