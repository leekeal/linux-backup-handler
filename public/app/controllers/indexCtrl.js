appCtrls.controller('indexCtrl', ['$scope', '$http',function($scope,$http){
	$scope.getDbs = function(){
		var getDbs = $http.get('dbs');
		
		getDbs.success(function(data){
			$scope.dbs = data;
		})
	}
}]);