var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var hbs = require('koa-hbs');
var app = koa();
var init = require('./init');



app.use(hbs.middleware({
	viewPath: __dirname + '/views'
}));

init.localFolder();/* Initialzation local folder*/
var ftps = init.connectRemoteServer(); 
init.remoteServer(ftps);

app.use(function *(next){
	this.ftps = ftps; /*Set ftps to context*/
	yield next;
})

app.use(router(app));
app.use(serve(__dirname + '/public'));

require('./controllers/backup')(app);
app.listen(3000);




