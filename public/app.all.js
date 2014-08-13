(function() {

window.app = angular.module('app', ['ngRoute','appCtrls']);
window.appCtrls = angular.module('appCtrls', []);




window.socket = io('http://localhost');
socket.on('connected', function (data) {
	console.log(data);
});

})();

(function() {

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
			}else if(rejection.status == 403){
				$location.path('login')
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
	var model = $scope.model = {};
	var data = $http.get("/config");
	data.success(function(data){
		model.url = data.url
		model.mysqldumpPath  = data.mysqldumpPath;
		model.administrator =  data.administrator;
		model.password = data.password;
		model.email = data.email;
	})

	$scope.edit = function(){
		$http.put("/config",model).success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
			}
			else{
				$scope.successMsg = "success";
			}
		})
	}
}]);

})();

(function() {

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

})();

(function() {

appCtrls.controller('database-editCtrl', ['$scope', '$http','$location','$routeParams',function($scope, $http,$location,$routeParams) {
	var model = $scope.model = {};
	$scope.events = {};

	$scope.pageTitle = 'database'
	$scope.buttonName = 'edit';
	var id = model.id = $routeParams.id;
	var getDatabase = $http.get('/dbs/'+id);
	getDatabase.success(function(data){
		/*更新页面的值，只能单独更新每个对象的属性，不能直接更新整体对象。*/
		model.title = data.title;
		model.host = data.host;
		model.name = data.name;
		model.username = data.username;
		model.password = data.password;
		model.folder = data.folder;
		model.remote = {};
		model.remote.on = data.remote.on;
		model.remote.folder = data.remote.folder;
		model.emailTo = data.emailTo;
	})

	$scope.events.submit = function(){
		$http.put("/db",model).success(function(data){
			if(data.error){
				console.log(data.error);
			}
			else{
				console.log(data);
			}
		})
	}
	

}]);

})();

(function() {

appCtrls.controller('database-statusCtrl',['$scope',function($scope){
	
}])

})();

(function() {

appCtrls.controller('databasesCtrl', ['$scope', '$http','$location',function($scope, $http,$location) {
	$scope.events = {};
	$scope.dbs = {}

	/*获取数据库列表*/
	var getDatabases = $http.get("/dbs");
	getDatabases.success(function(data){
		$scope.dbs = data;
	})


	/*订阅数据库备份状态*/
	socket.on('database', function (data) {
		var db = $scope.dbs[data.id];
		if(data.end){
			db.working.status = 'done';
			db.disabled = false
		}else{
			db.working = data.status;
		}
		$scope.$apply();/*手动刷新$scoope*/
	});


	/*请求备份*/
	$scope.events.backup = function(id){
		var db = $scope.dbs[id];

		$http.get("db-backup/" + id).success(function(status){
			if(status.error){
				console.log(status.error);
			}else{
				db.working = status;
				db.disabled = true;
			}
		})
	};



	// $scope.events.status = function(id){
	// 	$scope.currentDb = $scope.dbs[id];
	// }

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
	var model = $scope.model = {};
	model.url = 'http://' + $location.$$host + ':' + $location.$$port;
	$scope.toInstall = function(){
		$scope.currentView = 'install';
	}

	$scope.install = function(){
		var postToInstall = $http.post("/install",model);
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





})();

(function() {

appCtrls.controller('navbarCtrl', ['$scope','$rootScope','$http','$location',function($scope,$rootScope,$http,$location) {

	$scope.logout = function(){
		$http.get("/logout").error(function(error){
			$rootScope.credentials = null;
		})
	}

}]);

})();

(function() {

appCtrls.controller('testCtrl', ['$scope', '$http',function($scope, $http) {
	$scope.events = {}




	socket.on('database', function (data) {
		console.log(data);
	});




	$scope.events.test = function(){
		console.log('test click')
		$http.get('db-backup/2').success(function(data){
			if(data.error){
				console.error(data.error)
				return
			}
			console.log(data)

		})
	}

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

		$routeProvider.when('/databases', {
			templateUrl: 'views/databases.html',
			controller:'databasesCtrl'
		});

		$routeProvider.when('/database-add', {
			templateUrl: 'views/database-form.html',
			controller:'database-addCtrl'
		});

		$routeProvider.when('/databases/:id', {
			templateUrl: 'views/database-form.html',
			controller:'database-editCtrl'
		});

		$routeProvider.when('/test', {
			templateUrl: 'views/test.html',
			controller:'testCtrl'
		});

		$routeProvider.otherwise({
			redirectTo: '/test'
		});



	}]);


})();