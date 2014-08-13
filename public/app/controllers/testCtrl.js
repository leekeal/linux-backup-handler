appCtrls.controller('testCtrl', ['$scope', '$http',function($scope, $http) {
	$scope.events = {}




	socket.on('database', function (data) {
		console.log(data);
	});




	$scope.events.test = function(){
		console.log('test click')
		$http.get('db-backup/2').success(function(data){
			if(data.error){
				console.error(data.error)
				return
			}
			console.log(data)

		})
	}

}]);