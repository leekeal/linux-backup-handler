appCtrls.controller('database-editCtrl', ['$scope', '$http','$location','$routeParams',function($scope, $http,$location,$routeParams) {
	var model = $scope.model = {};
	$scope.events = {};

	$scope.pageTitle = 'database'
	$scope.buttonName = 'edit';
	var id = model.id = $routeParams.id;
	var getDatabase = $http.get('/dbs/'+id);
	getDatabase.success(function(data){
		/*更新页面的值，只能单独更新每个对象的属性，不能直接更新整体对象。*/
		model.title = data.title;
		model.host = data.host;
		model.name = data.name;
		model.username = data.username;
		model.password = data.password;
		model.folder = data.folder;
		model.remote = {};
		model.remote.on = data.remote.on;
		model.remote.folder = data.remote.folder;
		model.emailTo = data.emailTo;
	})

	$scope.events.submit = function(){
		$http.put("/db",model).success(function(data){
			if(data.error){
				console.log(data.error);
			}
			else{
				console.log(data);
			}
		})
	}
	

}]);