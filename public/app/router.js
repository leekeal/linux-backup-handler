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
