var fs = require('co-fs');
var querystring = require("querystring");
var jf = require('jsonfile')





module.exports = function(app){



	app.get('/website',function *(next){

		this.body = 'website backup success'
	});

}