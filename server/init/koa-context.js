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

	app.use(function *(next){
		console.log('--> '+this.url)
		if(this.post){
			console.log('------post-------')
			console.log(this.post)
		}
		yield next;
		console.log('------return-------')
		console.log(this.body)
	})

	

}