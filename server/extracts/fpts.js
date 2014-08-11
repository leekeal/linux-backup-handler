var FTPS = require('ftps');











// exports.connectRemoteServer = function(app){
// 	var FTPS = require('ftps');
// 	var ftps = new FTPS({
// 		host: 'fwind.me', 
// 		username: 'leeke', 
// 		password: 'ls62201991', 
// 		protocol: 'sftp',
// 	});

// 	return ftps;
// }

// exports.remoteServer = function(ftps){
// 	ftps.raw('mkdir -p '+config.database.remoteFolder).exec(function(err,data){
// 		if(data.error){
// 			console.log('配置文件设置的 数据库备份目录已经存在或者权限不够不能创建')
// 		}
// 	});
// }