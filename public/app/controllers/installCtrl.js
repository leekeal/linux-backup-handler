appCtrls.controller('installCtrl', ['$scope', '$http','$location',function($scope,$http,$location){
	$scope.currentView = 'msg';
	$scope.url = 'http://' + $location.$$host + ':' + $location.$$port;
	$scope.toInstall = function(){
		$scope.currentView = 'install';
	}

	$scope.install = function(){
		
		var data = {
			url : $scope.url,
			mysqldumpPath : $scope.mysqldumpPath,
			administrator : $scope.administrator,
			password : $scope.password,
			email:$scope.email
		}
		console.log(data)
		var postToInstall = $http.post("/install",data);

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