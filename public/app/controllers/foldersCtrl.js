appCtrls.controller('foldersCtrl', ['$scope', '$http','$location','$socket',function($scope, $http,$location,$socket) {
	$scope.events = {};
	$scope.folders = {}

	var getDatabases = $http.get("/folders");
	getDatabases.success(function(data){
		console.log(data);
		$scope.folders = data;
	})


	// /监听文件夹备份状态*/

	$socket.onOnce('folder',function(result){
		var folder = $scope.folders[result.id] || {};
		if(result.end){
			folder.working.status = 'done';
			folder.disabled = false
		}else{
			folder.disabled = true;
			folder.working = result.status;
		}
		$scope.$apply();/*手动刷新$scoope*/
	})


	$scope.events.backup = function(id){
		var folder = $scope.folders[id];
		$http.get('folder-backup/' + id).success(function(status){
			if(status.error){
				console.log(status.error);
			}else{
				folder.working = status;
				folder.disabled = true;
			}
		})
	}


}]);