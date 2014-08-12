var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var app = koa();
var port = process.env.PORT || 3000;
var co = require('co');
app.keys = ['linux_backup_handler', 'asdfijdlkfjaskdljfwerjdafsf'];



app.use(serve('./public'));
require('./server/init/config')(app);
require('./server/init/mail')(app);
require('./server/init/koa-context')(app);
require('./server/init/loginCheck')(app);
/*-------------- Front of router --------------------*/
app.use(router(app));
/*-------------- Behind of router --------------------*/

require('./server/controllers/user')(app);
require('./server/controllers/backup')(app);
require('./server/controllers/configuration')(app);
require('./server/controllers/db')(app);
app.listen(port);
console.info('Server startup  was successful. \nhttp://127.0.0.1:'+port)













