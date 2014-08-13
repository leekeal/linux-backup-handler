/*路由发生改变*/
app.run(['$rootScope', '$window', '$location', '$http', function ($rootScope, $window, $location, $http) {  

	var credentials = $rootScope.credentials = {};


	var running = false;
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
		running = true;
	});

	/*每次重新路由时候判断用户是否登录*/
	$rootScope.$on('$routeChangeStart', function(event,next){
		if(running){ /*启动的时候从服务器获取登录状态，不用用户名存在与否判断*/
			if(!credentials.username && $location.path() != '/install'){
				$location.path('login')
			}else if($location.path() == '/login'){
				$location.path('/')
			}
		}
	});


}]);





