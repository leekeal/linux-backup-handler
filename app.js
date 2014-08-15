var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var app = koa();
var port = process.env.PORT || 3000;
var co = require('co');
app.keys = ['linux_backup_handler', 'asdfijdlkfjaskdljfwerjdafsf'];


var io = {};
var socketIo = {};
app.use(function *(next){
	this.io = io;
	this.socketIo = socketIo;
	yield next;
})
app.use(serve('./public'));
require('./server/init/config')(app);
require('./server/init/koa-context')(app);
require('./server/init/loginCheck')(app);
/*-------------- Front of router --------------------*/
app.use(router(app));
/*-------------- Behind of router --------------------*/

var server = require('http').Server(app.callback())

io = require('socket.io')(server);

io.on('connection', function(newSocket){
	socketIo = newSocket;
	socketIo.emit('connected', 'Socket connect succeed');
});


require('./server/controllers/user')(app);
require('./server/controllers/folder')(app);
require('./server/controllers/backup')(app);
require('./server/controllers/configuration')(app);
require('./server/controllers/db')(app);
server.listen(port);
console.info('Server startup  was successful. \nhttp://127.0.0.1:'+port)













