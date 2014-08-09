var config = require('../config');
var fs = require('co-fs');
var dateFormat = require('dateformat');
var querystring = require("querystring");
var ms2date = require('ms2date');
var child_process = require('child_process');
var thunkify = require('thunkify');
var exec = thunkify(child_process.exec);
var q = require('q');

var dbConfig = config.database;
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
			var backupStartTime = new Date().getTime();
			yield exec(config.mysqldumpPath+command);
			var backupTime = new Date().getTime() - backupStartTime;

			var gzipStartTime = new Date().getTime();
			yield exec('gzip ' + path);
			var gzipTime = new Date().getTime() - gzipStartTime;
		}catch(err){
			yield fs.unlink(path);
			this.body = '数据库备份失败,请检查数据库帐号密码';
			return
		}
		fileName += '.gz';
		path += '.gz'; /*压缩后的文件名*/
		var uploadStartTime = new Date().getTime()
		this.ftps.put(path,dbConfig.remoteFolder).exec(function(err,data){
			if(data.error){
				console.error(data);
			}else{
				var uploadingTime = new Date().getTime() - uploadStartTime
				console.log(fileName + '备份上传成功成功,上传时间为' + ms2date(uploadingTime));
			}
		})
		this.body = '<p>' + fileName + ' 备份成功，正在上传到服务器，请稍后查看。<br>'
		+ '数据导出时间: ' + ms2date(backupTime) + '<br>'
		+ '压缩时间: ' + ms2date(backupTime) + '<br>' 
		+ '</p>';

	});

app.get(BaseURL+'website',function *(next){

	this.body = 'website backup success'
});

}