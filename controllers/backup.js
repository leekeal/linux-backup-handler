var config = require('../config');
var fs = require('co-fs');
var dateFormat = require('dateformat');
var querystring = require("querystring");
var dbConfig = config.database;

var child_process = require('child_process');
var thunkify = require('thunkify');
var exec = thunkify(child_process.exec);

var q = require('q');

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
		var fileName = dbConfig.name + '-' + time + '.sql'
		var path = dbConfig.folder + fileName;
		var command = ' -u'+dbConfig.username+ ' -p'+dbConfig.password+'  '+dbConfig.name+' > ' + path;
		try{ 
			yield exec(config.mysqldumpPath+command);
			yield exec('gzip ' + path);
		}catch(err){
			yield fs.unlink(path);
			this.body = '数据库备份失败,请检查数据库帐号密码';
			return
		}
		path += '.gz'; /*压缩后的文件名*/
		this.ftps.put(path,dbConfig.remoteFolder).exec(function(err,data){
			if(data.error){
				console.error(data);
			}
		})
		this.body = fileName + '备份成功，正在上传到服务器，请稍后查看'

	});

	app.get(BaseURL+'website',function *(next){

		this.body = 'website backup success'
	});

}