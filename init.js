var fs = require('fs-extra');
var config = require('./config');

module.exports = function(){
	// create backup folder of database
	if(!fs.existsSync(config.database.folder)){
		console.log('backup folder of database is not exist');
		fs.mkdirsSync(config.database.folder);
		console.log('Have created backup folder of database');
	}

	setKuaipanInfo();
}



function setKuaipanInfo(){
	var kuaipan = require("./lib/kuaipan");
	var USerInfoFile = './cache/userinfo.json'

	try	{
		kuaipan.setKey("consumer_key","xc82kj5F9yIxT3Tv");
		kuaipan.setKey("consumer_secret","GFGeJ1jIsajxGwOl");
		// 授权文件存在，获取授权信息
		var userinfo = JSON.parse(fs.readFileSync(USerInfoFile));
		kuaipan.setKey("oauth_token",userinfo.oauth_token);
		kuaipan.setKey("oauth_token_secret",userinfo.oauth_token_secret);
	}catch(err){

		console.log('用户accessToken加载失败')
		throw err;
	}
}