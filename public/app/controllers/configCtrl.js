appCtrls.controller('configCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	var model = $scope.model = {};
	var data = $http.get("/config");
	data.success(function(data){
		model.url = data.url
		model.mysqldumpPath  = data.mysqldumpPath;
		model.administrator =  data.administrator;
		model.password = data.password;
		model.email = data.email;
	})

	$scope.edit = function(){
		$http.put("/config",model).success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$scope.successMsg = "success";
			}
		})
	}
}]);