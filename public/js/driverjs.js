var UberPrototype = angular.module('UberPrototype',[]);

UberPrototype.controller('loginController', function($scope, $http) {
	$scope.user = {};
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/addDriver',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"firstName": $scope.firstName,
				"lastName": $scope.lastName,
				"mobileNumber":$scope.mobileNumber,
				"carModel" : $scope.carModel, 
				"carColor": $scope.carColor,
				"carYear":$scope.carYear,
				"address": $scope.address,
				"city": $scope.city,
				"state": $scope.state,
				"zipCode": $scope.zipCode
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				alert(data.errorMessage);
			}
			else
				//Making a get call to the '/homePage' API
				window.location.assign("/Log_In"); 
		}).error(function(error) {
			$scope.invalid_login = true;
		});
	};
});