appCtrls.controller('configCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	var data = $http.get("/config");
	data.success(function(data){
		console.log(data);
		$scope.url = data.url;
		$scope.mysqldumpPath  = data.mysqldumpPath;
		$scope.administrator =  data.administrator;
		$scope.password = data.password;
		$scope.email = data.email;
	})
}]);