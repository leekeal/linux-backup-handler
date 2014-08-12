appCtrls.controller('loginCtrl', ['$scope','$rootScope', '$http','$location',function($scope,$rootScope,$http,$location) {

	console.log('login')
	
	$scope.login = function(){
		var data = {
			"username" : $scope.username ,
			"password" : $scope.password
		}

		
		/*post发送数据*/
		var login = $http.post("/login",data);
		
		/*发送成功*/
		login.success(function(data){
			/*不正确显示错误信息*/
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$rootScope.credentials.username = data.username;
				$location.path('/');
				console.log($rootScope.credentials)
				console.log('login success')
			}	


		})

		
	}

}]);



