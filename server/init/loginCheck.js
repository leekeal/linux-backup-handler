module.exports = function(app){
	app.use(function *(next){
		if(this.session.user || this.path == '/login' || this.path == '/install'){
			yield next;
		}
		else{
			this.status = 403;
			this.body = {"offline":"offline"};
		}

	})
}