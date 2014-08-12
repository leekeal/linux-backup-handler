module.exports = function(app){
	app.use(function *(next){
		if(this.session.user || this.path == '/login'){
			yield next;
		}
		else{
			this.body = {"offline":"offline"};
		}

	})
}