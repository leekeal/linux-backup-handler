var koa = require('koa');
var fs = require('fs-extra');
var serve = require('koa-static');
var router = require('koa-router');
var hbs = require('koa-hbs');
var app = koa();


app.use(hbs.middleware({
	viewPath: __dirname + '/views'
}));
app.use(router(app));
app.use(serve(__dirname + '/public'));

require('./controllers/backup')(app);
require('./controllers/kuipan_authorize')(app);


require('./init')();
app.listen(3000);




