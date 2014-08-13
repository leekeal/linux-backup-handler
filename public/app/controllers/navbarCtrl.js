appCtrls.controller('navbarCtrl', ['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location) {

	$scope.logout = function(){
		$http.get("/logout").error(function(error){
			$rootScope.credentials = null;
		})
	}

}]);