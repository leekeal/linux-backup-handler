var koa = require('koa');
var serve = require('koa-static');
var app = koa();
var port = process.env.PORT || 3000;
var co = require('co');
app.keys = ['linux_backup_handler', 'asdfijdlkfjaskdljfwerjdafsf'];



co(function *(){
	app.use(serve('./public'));
	yield require('./server/init/config')(app);
	require('./server/init/mail')(app);
	/*-------------- Front of router --------------------*/
	require('./server/init/koa-context')(app);
	/*-------------- Behind of router --------------------*/
	require('./server/controllers/user')(app);
	require('./server/controllers/backup')(app);
	require('./server/controllers/configuration')(app);
	require('./server/controllers/db')(app);
	app.listen(port);
	console.info('Server startup  was successful. \nhttp://127.0.0.1:'+port)

})()











