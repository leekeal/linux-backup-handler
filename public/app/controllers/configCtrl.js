appCtrls.controller('configCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	var data = $http.get("/config");
	data.success(function(data){
		// model = data;/*这种写法，视图不会更新*/
		$scope.model = data
	})

	$scope.edit = function(){
		$scope.model.email.service = 'gmail'
		$http.put("/config",$scope.model).success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$scope.successMsg = "success";
			}
		})
	}
}]);