var config = require('../config');
var fs = require('fs');
var child_process = require('child_process');
var thunkify = require('thunkify');
var dateFormat = require('dateformat');
var querystring = require("querystring");
var database = config.database;
var request = require('request');
var exec = thunkify(child_process.exec);
var database = config.database;
var q = require('q');
var kuaipan = require("../lib/kuaipan");

var readFile = thunkify(fs.readFile);

var URL = config.url;
var BaseURL = config.baseUrl;
var USerInfoFile = 'cache/userinfo.json'
module.exports = function(app){
	app.get(BaseURL,function *(next){
		yield this.render('index');
	})

	app.get(BaseURL+'database',function *(next){
		var self = this;
		var time = dateFormat(new Date(), "yyyymmdd-HHMMss");
		var fileName = database.name + time + '.sql'
		var path = database.folder + fileName;
		var command = ' -u'+database.username+ ' -p'+database.password+' '+database.name+' > ' + path; 
		var result = yield exec(config.mysqldumpPath+command);

		var fileStream = fs.createReadStream(path);
		kuaipan.uploadFile({root:'app_folder',path:'test/'+ fileName},fileStream,function(err,data){
			console.log(data)
		})
		this.body = fileName + ' 本地备份成功，正在压缩上传到快盘，请稍后查看！';

	});

	app.get(BaseURL+'website',function *(next){

		this.body = 'website backup success'
	});

}