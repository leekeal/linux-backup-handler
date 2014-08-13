appCtrls.controller('loginCtrl', ['$scope','$rootScope', '$http','$location',function($scope,$rootScope,$http,$location) {
	var model = $scope.model = {};
	$scope.login = function(){
		/*post发送数据*/
		var login = $http.post("/login",model);
		
		/*发送成功*/
		login.success(function(data){
			/*不正确显示错误信息*/
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$rootScope.credentials.username = data.username;
				$location.path('/');
				console.log('login success')
			}	


		})

		
	}

}]);



