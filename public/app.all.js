(function() {

window.app = angular.module('app', ['ngRoute','appCtrls']);
window.appCtrls = angular.module('appCtrls', []);







})();

(function() {

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







})();

(function() {


app.factory('installedChecker', ['$q','$location', function($q,$location) {
	return{
		responseError: function(rejection) {
			if(rejection.status == 500 && rejection.data.install){
				$location.path('install')
			}
			else if(rejection.status == 500 && rejection.data.installed){
				$location.path('/')
				console.log('installed');
			}
			return $q.reject(rejection);
		}
	};
}]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('installedChecker');
}]);

})();

(function() {

appCtrls.controller('configCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	var data = $http.get("/config");
	data.success(function(data){
		console.log(data);
		$scope.url = data.url;
		$scope.mysqldumpPath  = data.mysqldumpPath;
		$scope.administrator =  data.administrator;
		$scope.password = data.password;
		$scope.email = data.email;
	})
}]);

})();

(function() {

appCtrls.controller('indexCtrl', ['$scope', '$http',function($scope,$http){
	$scope.getDbs = function(){
		var getDbs = $http.get('dbs');
		
		getDbs.success(function(data){
			$scope.dbs = data;
		})
	}
}]);

})();

(function() {

appCtrls.controller('installCtrl', ['$scope', '$http','$location',function($scope,$http,$location){
	$scope.currentView = 'msg';
	$scope.url = 'http://' + $location.$$host + ':' + $location.$$port;
	$scope.toInstall = function(){
		$scope.currentView = 'install';
	}

	$scope.install = function(){
		
		var data = {
			url : $scope.url,
			mysqldumpPath : $scope.mysqldumpPath,
			administrator : $scope.administrator,
			password : $scope.password,
			email:$scope.email
		}
		console.log(data)
		var postToInstall = $http.post("/install",data);

		postToInstall.success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$scope.currentView = 'installed';
			}
		})
	}	

}]);

})();

(function() {

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





})();

(function() {

appCtrls.controller('navbarCtrl', ['$scope','$http','$location',function($scope,$http,$location) {
	console.log('navbar')
	// $scope.username =  $rootScope.credentials.username;

}]);

})();

(function() {

appCtrls.controller('testCtrl', ['$scope', '$http','System',function($scope, $http,System) {

	console.log(System)

}]);

})();

(function() {

app.config(['$routeProvider',
	function($routeProvider) {
		/*当url为xxxxxxx/#/login就显示login.html */
		$routeProvider.when('/login', {
			templateUrl: 'views/login.html',
			controller:'loginCtrl'
		});
		$routeProvider.when('/', {
			templateUrl: 'views/index.html',
			controller:'indexCtrl'
		});

		$routeProvider.when('/install', {
			templateUrl: 'views/install.html',
			controller:'installCtrl'
		});

		$routeProvider.when('/config', {
			templateUrl: 'views/config.html',
			controller:'configCtrl'
		});

		$routeProvider.otherwise({
			redirectTo: '/test'
		});



	}]);


})();