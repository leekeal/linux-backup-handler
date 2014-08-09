module.exports = {
	url:'http://127.0.0.1:3000',
	baseUrl:'/',
	mysqldumpPath : '/Applications/MAMP/Library/bin/mysqldump ',
	database:{
		host:'localhost',
		name:'test',
		username:'leeke',
		password:'pw62201991db',
		folder:'./backup/database/',/*最后的文件夹名词后必须加 '/' */
		remoteFolder:'./backup/database/',
	},
}