appCtrls.controller('loginCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {


	
	$scope.login = function(){
		var data = {
			"username" : $scope.username ,
			"password" : $scope.password
		}

		

		var login = $http.post("/login",data);

		login.success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$location.path('/');
			}	


		})

		
	}

}]);