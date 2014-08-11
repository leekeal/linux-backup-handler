var nodemailer = require('nodemailer');
module.exports = function(app){
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'leeke.priv@gmail.com',
			pass: 'ls20080813'
		}
	});

	function sendMail(to,subject,text,cb){
		transporter.sendMail({
			from: 'leeke.priv@gmail.com',
			to: to,
			subject: subject,
			text: text
		},function(err,info){
			cb(err,info)
		});
	}

	app.use(function *(next){
		this.sendMail = sendMail;
		yield next;
	})
}