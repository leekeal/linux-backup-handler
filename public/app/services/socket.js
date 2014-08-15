app.service('$socket',function(){

	var socket = init();
	var events = this.events = {};




	this.onOnce = function(name,cb){
		if(events[name]){
			delete events[name]
			events[name] = cb;
		}else{
			events[name] = cb;
			socket.on(name,function(result){
				events[name](result)
			});
		}
	}





});


function init(){
	var socket = io('http://localhost');
	socket.on('connected', function (data) {
		console.log(data);
	});
	return socket;
}

/*路由发生改变*/
app.run(['$socket', function ($socket) {  
	console.log($socket)
	

}]);