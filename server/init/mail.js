var nodemailer = require('nodemailer');
module.exports = function(app){

	var email = app.config.email || {};
	var transporter = nodemailer.createTransport({
		service: email.service,
		auth: {
			user: email.address,
			pass: email.password
		}
	});

	function sendMail(to,subject,text,cb){
		transporter.sendMail({
			from: email.address,
			to: to,
			subject: subject,
			text: text
		},function(err,info){
			console.log(info)
			if(cb){
				cb(err,info)
			}
		});
	}
	app.use(function *(next){
		this.sendMail = sendMail;/*set the email handler into the context*/
		yield next;
	})
}