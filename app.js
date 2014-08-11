var koa = require('koa');
var app = koa();
var port = process.env.PORT || 3000;
app.keys = ['linux_backup_handler', 'asdfijdlkfjaskdljfwerjdafsf'];



require('./server/init/config')(app);
require('./server/init/mail')(app);
/*configfile must be front of router */
require('./server/init/koa-context')(app);



require('./server/controllers/user')(app);
require('./server/controllers/backup')(app);
require('./server/controllers/configuration')(app);
require('./server/controllers/db')(app);
app.listen(port);
console.info('Server startup  was successful. \nhttp://127.0.0.1:'+port)




