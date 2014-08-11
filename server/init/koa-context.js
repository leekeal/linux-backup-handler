var router = require('koa-router');
var hbs = require('koa-hbs');
var koaBody = require('koa-body');
var session = require('koa-session');
module.exports = function(app){

	
	app.use(session());
	app.use(koaBody());
	app.use(function *(next){
		this.post = this.request.body;
		yield next
	})

	app.use(hbs.middleware({
		viewPath:'./views'
	}));

	app.use(router(app));

}