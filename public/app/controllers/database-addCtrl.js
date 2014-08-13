appCtrls.controller('database-addCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	var model = $scope.model = {};
	$scope.events = {};

	$scope.buttonName = "add";
	$scope.pageTitle = "Add datebase"
	$scope.events.submit= function(){
		$http.post("/db",model).success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$location.path("databases");
			}
		})
	}
}]);