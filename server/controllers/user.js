module.exports = function(app){
	app.post('/login',function *(next){
		console.log(this.post)
		var username = this.post.username;
		var password = this.post.password;
		if(username === this.config.administrator && password === this.config.password){
			this.session.user = username;
			this.body = {username:username}
		}else{
			this.body = {error:'Username and Password are wrong'}
		}
	})
	app.get('/status',function *(next){
		var configExists = yield this.config.exists();
		if(!this.session.user){
			this.body = {error:'offline'}
		}else{
			this.body = 'online'
		}
	})

	app.get('/logout',function *(next){
		this.session = null;
		this.body = 'logout succeed'
	})
}