/*路由发生改变*/
app.run(['$rootScope', '$window', '$location', '$http', function ($rootScope, $window, $location, $http) {  

	var credentials = $rootScope.credentials = {};

	/*程序启动判断用户是否登录*/
	var url = '/status';
	var getStatus = $http.get(url);
	getStatus.success(function(data){
		if(data.offline){
			$location.path('login')
		}
		else{
			$rootScope.credentials.username = data.username;
			if($location.path() == '/login'){
				$location.path('/')
			}
		}
	});

	/*每次重新路由时候判断用户是否登录*/
	$rootScope.$on('$routeChangeStart', function(event,next){
		if(!credentials.username){
			$location.path('login')
		}else if($location.path() == '/login'){
			$location.path('/')
		}

	});


}]);





