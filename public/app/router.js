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
