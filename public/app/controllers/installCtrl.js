appCtrls.controller('installCtrl', ['$scope', '$http','$location',function($scope,$http,$location){
	$scope.currentView = 'msg';
	var model = $scope.model = {};
	model.url = 'http://' + $location.$$host + ':' + $location.$$port;
	$scope.toInstall = function(){
		$scope.currentView = 'install';
	}

	$scope.install = function(){
		var postToInstall = $http.post("/install",model);
		postToInstall.success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$scope.currentView = 'installed';
			}
		})
	}	

}]);