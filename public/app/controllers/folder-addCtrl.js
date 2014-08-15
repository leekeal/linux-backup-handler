appCtrls.controller('folder-addCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	var model = $scope.model = {};
	$scope.events = {};

	$scope.buttonName = "add";
	$scope.pageTitle = "Add folder"
	$scope.events.submit= function(){
		$http.post("/folder",model).success(function(data){
			if(data.error){
				console.log(data.error);
				$scope.errorMsg = data.error;
			}
			else{
				console.log(data);
			}
		})
	}
}]);