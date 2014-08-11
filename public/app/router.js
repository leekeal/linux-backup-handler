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
