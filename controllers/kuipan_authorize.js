var config = require('../config');
var fs = require('fs');
var child_process = require('child_process');
var thunkify = require('thunkify');
var dateFormat = require('dateformat');
var querystring = require("querystring");
var database = config.database;
var request = require('request');
var database = config.database;
var q = require('q');
var kuaipan = require("../lib/kuaipan");

var URL = config.url;
var BaseURL = config.baseUrl;
var USerInfoFile = 'cache/userinfo.json'

module.exports = function(app){

	//获取临时token
	app.get(BaseURL+'kuaipan',function *(next){
		var deferred = q.defer();
		kuaipan.getAuthorization(URL + "/kuaipan_cb",function(d){
			deferred.resolve(d);
		});
		var url  = yield deferred.promise;
		this.redirect(url);
	});
	//回调地址，获取正式token
	app.get(BaseURL+'kuaipan_cb',function *(next){
		var query  = this.query;
		kuaipan.setKey("oauth_token",query.oauth_token);
		kuaipan.setKey("oauth_verifier",query.oauth_verifier);

		var deferred = q.defer();
		kuaipan.getAccessToken(function(user_oauth_token){
			deferred.resolve(user_oauth_token);
		});
		var user_oauth_token = yield deferred.promise;

		// create backup folder of database
		console.log(user_oauth_token)
		fs.writeFileSync(USerInfoFile,JSON.stringify(user_oauth_token));

		this.redirect('kuaipan_info');
	});

	//获取用户信息
	app.get(BaseURL+'kuaipan_info',function *(next){
		var deferred = q.defer();
		kuaipan.getAccountInfo(function(userInfo){
			deferred.resolve(userInfo);
		});
		var userInfo = yield deferred.promise;
		this.body = userInfo
	});

}