var fs = require('co-fs');
var querystring = require("querystring");
var backup = require('../extracts/backup');
var jf = require('jsonfile')





module.exports = function(app){

	app.get('database',function *(next){
		this.body = '正在导出数据' + dbConfig.title;

		var mysql = backup.mysql(dbConfig,500)
		mysql.then(function(results){
			console.log(results)
		});
		mysql.progress(function(results){
			console.log(results)
		});
		mysql.fail(console.error)

	});

	app.get('/website',function *(next){

		this.body = 'website backup success'
	});

}