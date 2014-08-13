appCtrls.controller('databasesCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	$scope.events = {};
	$scope.dbs = {}

	/*获取数据库列表*/
	var getDatabases = $http.get("/dbs");
	getDatabases.success(function(data){
		$scope.dbs = data;
	})


	/*订阅数据库备份状态*/
	socket.on('database', function (data) {
		var db = $scope.dbs[data.id];
		if(data.end){
			db.working.status = 'done';
			db.disabled = false
		}else{
			db.working = data.status;
		}
		$scope.$apply();/*手动刷新$scoope*/
	});


	/*请求备份*/
	$scope.events.backup = function(id){
		var db = $scope.dbs[id];

		$http.get("db-backup/" + id).success(function(status){
			if(status.error){
				console.log(status.error);
			}else{
				db.working = status;
				db.disabled = true;
			}
		})
	};



	// $scope.events.status = function(id){
	// 	$scope.currentDb = $scope.dbs[id];
	// }

}]);