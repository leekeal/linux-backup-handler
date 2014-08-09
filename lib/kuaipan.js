/**
 * 金山快盘开放平台 js SDK
 *
 * @version 1.0
 * @date 2012-3-29
 * @author frycn frycnx(at)gmail.com
 * @qq 284763529
 * @encoding UTF-8
 */

 var fs = require("fs");
 var url = require("url");
 var http = require("http");
 var https = require("https");
 var crypto = require("crypto");
 var querystring = require("querystring");
 var request = require('request');
//授权码
// var consumer_key = "xcC8qU3GBEzH8kOh";
// var consumer_secret = "IphFPT6gvHovU4D2";
var consumer_key = null;
var consumer_secret = null;
//获取的token
var oauth_token=null;
var oauth_verifier=null;
var oauth_token_secret=null;

    /**
     * 设置key
     * @param string key
     * @param string val
     */
     function setKey(key,val){
     	eval(key+"='"+val+"'");
     }

    /**
     * 生成临时token
     * @param string cburl  回调url
     * @param string callback  回调函数
     */
     function getAuthorization(cburl,callback){
     	var url="https://openapi.kuaipan.cn/open/requestToken";
     	var oauth_url="https://www.kuaipan.cn/api.php?ac=open&op=authorise&oauth_token=";
     	var params=createParam({ oauth_callback : cburl });
     	params["oauth_signature"]=createSign(url,"GET",params);
     	origin_request(url+"?"+querystring.stringify(params),'get',function(d){
     		var r=JSON.parse(d);
     		if(r.oauth_callback_confirmed){
     			oauth_token=r.oauth_token;
     			oauth_token_secret=r.oauth_token_secret;
     			if(callback)callback(oauth_url+r.oauth_token);
     		}
     	});
     }

    /**
     * 生成正式token
     * @param string callback  回调函数
     */
     function getAccessToken(callback){
     	var url="https://openapi.kuaipan.cn/open/accessToken";
     	var params=createParam({
     		oauth_token:oauth_token,
     		oauth_verifier:oauth_verifier
     	});
     	params["oauth_signature"]=createSign(url,"GET",params,oauth_token_secret);
     	origin_request(url+"?"+querystring.stringify(params),'get',function(d){
     		var r=JSON.parse(d);
     		if(r.user_id){
     			oauth_token=r.oauth_token;
     			oauth_token_secret=r.oauth_token_secret;
     			var user_oauth_token = {oauth_token:oauth_token,oauth_token_secret:oauth_token_secret};
     			if(callback)callback(user_oauth_token);
     		}
     	});
     }

    /**
     * 通用api
     * @param string apiurl  api地址
     * @param string callback  回调函数
     * @param string param  参数
     * @param string method  调用参数
     * @param string data  POST数据
     */
     function apis(apiurl,callback,param,method,data){
     	method=method||"GET";
     	param=param||{};
     	param["oauth_token"]=oauth_token;
     	var params=createParam(param);
     	params["oauth_signature"]=createSign(apiurl,method,params,oauth_token_secret);

          console.log(apiurl+"?"+querystring.stringify(params))
          origin_request(apiurl+"?"+querystring.stringify(params),method,function(d){
            if(callback)callback(JSON.parse(d));
       },(data||""));
     }

    /**
     * 获取用户信息
     * @param string callback  回调函数
     */
     function getAccountInfo(callback){
     	apis("http://openapi.kuaipan.cn/1/account_info",callback,{},"get");
     }

    /**
     * 获取文件信息
     * @param string path  文件路径
     * @param string callback  回调函数
     * @param string param  参数
     */
     function getMetadata(path,callback,param){
     	apis("http://openapi.kuaipan.cn/1/metadata/"+path,callback,param,"get");
     }

    /**
     * 获取分享链接
     * @param string path  文件路径
     * @param string callback  回调函数
     */
     function getShareLink(path,callback){
     	apis("http://openapi.kuaipan.cn/1/shares/"+path,callback,{},"get");
     }

    /**
     * 新建文件
     * @param string callback  回调函数
     * @param string param  参数
     */
     function createFile(callback,param){
     	apis("http://openapi.kuaipan.cn/1/fileops/create_folder",callback,param,"get");
     }

    /**
     * 删除文件
     * @param string callback  回调函数
     * @param string param  参数
     */
     function deleteFile(callback,param){
     	apis("http://openapi.kuaipan.cn/1/fileops/delete",callback,param,"get");
     }

    /**
     * 移动文件
     * @param string callback  回调函数
     * @param string param  参数
     */
     function moveFile(callback,param){
     	apis("http://openapi.kuaipan.cn/1/fileops/move",callback,param,"get");
     }

    /**
     * 复制文件
     * @param string callback  回调函数
     * @param string param  参数
     */
     function copyFile(callback,param){
     	apis("http://openapi.kuaipan.cn/1/fileops/copy",callback,param,"get");
     }

    /**
     * 上传文件
     * @param string callback  回调函数
     * @param string param  上传参数
     * @param string param  获取上传地址参数
     */
     function uploadFile(param,fileStream,callback){
     	apis("http://api-content.dfs.kuaipan.cn/1/fileops/upload_locate",function(d){
     		// apis(d['url']+"/1/fileops/upload_file",callback,{},"post",param);
               param["oauth_token"]=oauth_token;
               var params=createParam(param);
               var apiurl = d['url']+"/1/fileops/upload_file";
               method = 'post';
               params["oauth_signature"]=createSign(apiurl,method,params,oauth_token_secret);

               var uploadUrl = apiurl + "?"+querystring.stringify(params)
               var r = request.post(uploadUrl, function optionalCallback (err, httpResponse, body) {
                   if(err){
                    callback(err);
                   }
                   else{
                    callback(null,body);
                   }
               })
               var form = r.form()
               form.append('file',fileStream)

          },({}),"get");
     }



    /**
     * 下载文件
     * @param string callback  回调函数
     * @param string param  参数
     */
     function downloadFile(callback,param,param2){
     	apis("http://api-content.dfs.kuaipan.cn/1/fileops/download_file",callback,param,"get");
     }

    /**
     * 获取缩略图
     * @param string callback  回调函数
     * @param string param  参数
     */
     function getThumbnail(callback,param){
     	apis("http://conv.kuaipan.cn/1/fileops/thumbnail",callback,param,"get");
     }

    /**
     * 文档转换
     * @param string callback  回调函数
     * @param string param  参数
     */
     function documentView(callback,param){
     	apis("http://conv.kuaipan.cn/1/fileops/documentView",callback,param,"get");
     }

//成生签名
function createSign(url, method, params, token_secret){
	var key=encode(consumer_secret||"")+'&'+encode(token_secret||"");
	var turl=[];
	turl.push(method.toUpperCase());
	turl.push(encode(url));
	turl.push(encode(querystring.stringify(ksort(params))));
	return crypto.createHmac("sha1",key).update(turl.join("&")).digest("base64");
}

//合并参数
function createParam(params){
	var d=(new Date()).getTime();
	var tmps={
		oauth_consumer_key:consumer_key,
		oauth_signature_method:"HMAC-SHA1",
		oauth_version:"1.0",
		oauth_timestamp:Math.round(d/1000),
		oauth_nonce:d
	};
	for(var k in params){
		tmps[k]=params[k];
	}
	return tmps;
}

//参数排序
function ksort(paramArr){
	var keys=[];
	for(var k in paramArr){
		keys.push(k);
	}
	keys=keys.sort();
	var params={};
	for(var k in keys){
		params[keys[k]]=paramArr[keys[k]];
	}
	return params;
}

function encode(s){
	s = encodeURIComponent(s);
	s = s.replace(/\!/g, "%21");
	s = s.replace(/\*/g, "%2A");
	s = s.replace(/\'/g, "%27");
	s = s.replace(/\(/g, "%28");
		s = s.replace(/\)/g, "%29");
		return s;
	}

//设置http头
var header={
	"Accept":"*/*",
	"Accept-Language":"zh-CN",
	"Connection":"Keep-Alive",
	"Cookie":"",
	"Referer":"",
	"User-Agent":"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)"
};

//请求连接
function origin_request(uri,method,callback,data,headers)
{
	var opts = {};
	data = data || "";
	method = method || "GET";
	headers = headers || {};
	var curl = url.parse(uri);
	var web=curl.protocol=="http:"? http: https;
	//处理请求头
	for(var key in header){
		if(!headers[key])headers[key] = header[key];
	}
	if(method.toLowerCase() == "post") {
		headers["Content-Length"] = data.length;
		headers["Content-Type"] = "application/x-www-form-urlencoded";
	}
	//组织参数
	opts.path = curl.path;
	opts.host = curl.host;
	opts.port = curl.protocol=="http:"? 80: 443;
	opts.method = method;
	opts.headers = headers;

	//请求开始
	web.request(opts,function(res){
		var chunk=[];
		//读取数据
		res.on("data",function(d){
			chunk.push(d);
		}).on("end",function(){
			//设置头
			header["Referer"]=uri;
			if(res.headers["set-cookie"]) {
				if(header['Cookie']==''){
					header['Cookie']=res.headers["set-cookie"];
				}else{
					header['Cookie']+=','+res.headers["set-cookie"];
				}
			}
			if(callback)callback(chunk.join(""));
		});
	}).on("error",function(e){
		console.log("Got error: " + e.message);
	}).end(data);
}

exports.setKey=setKey;
exports.getAuthorization=getAuthorization;
exports.getAccessToken=getAccessToken;
exports.getAccountInfo=getAccountInfo;
exports.getMetadata=getMetadata;
exports.getShareLink=getShareLink;
exports.createFile=createFile;
exports.deleteFile=deleteFile;
exports.moveFile=moveFile;
exports.copyFile=copyFile;
exports.uploadFile=uploadFile;
exports.downloadFile=downloadFile;
exports.getThumbnail=getThumbnail;
exports.documentView=documentView;