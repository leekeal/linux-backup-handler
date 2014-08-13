
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