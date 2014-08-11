(function() {

window.app = angular.module('app', ['ngRoute','appCtrls']);
window.appCtrls = angular.module('appCtrls', []);














})();

(function() {

app.service('System', function(){
	this.username = 'test';
});

})();

(function() {

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

})();

(function() {

appCtrls.controller('testCtrl', ['$scope', '$http','System',function($scope, $http,System) {

	console.log(System)

}]);

})();

(function() {

app.config(['$routeProvider',
	function($routeProvider) {

		$routeProvider.when('/login', {
			templateUrl: 'views/login.html',
			controller:'loginCtrl'
		});


		$routeProvider.when('/form', {
			templateUrl: 'views/form.html',

		});

		$routeProvider.when('/add', {
			templateUrl: 'views/add.html',

		});

		$routeProvider.when('/list', {
			templateUrl: 'views/list.html',

		});

		$routeProvider.when('/navbar', {
			templateUrl: 'views/navbar.html',

		});
		$routeProvider.when('/', {
			templateUrl: 'views/index.html',
			controller:'indexCtrl'
		});

		$routeProvider.when('/test', {
			templateUrl: 'views/test.html',
			controller:'testCtrl'
		});

		$routeProvider.otherwise({
			redirectTo: '/other'
		});


	}]);


})();