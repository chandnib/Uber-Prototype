UberPrototypeCustomer.directive('googlesource', function() {
	//directive for Google Auto complete option for source
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.src = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.src, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

UberPrototypeCustomer.directive('googledestination', function() {
	//directive for Google Auto complete option for destination
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.dest = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.dest, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

UberPrototypeCustomer.controller('DriverTripsController',function($scope,$http,$location,$window){
	$scope.curuser = {};
	$window.localStorage.category = "D";
	
	
	 $scope.initMyTrips = function(){
		  
		  console.log("inside initMyTrips" + $window.localStorage.driverId);
		  
			 $scope.TripDetails = true;
			 $http({
					method : "GET",
					url : '/getDriverTripSummary',
					params : {
						"driver_id" : $window.localStorage.driverId
					}
				}).success(function(data) {
					if (data.code == 200) {
						$scope.mytrips = data.value;
						
						for(var i=0; i < $scope.mytrips.length;i++)
							{
							console.log($scope.mytrips[i].STATUS);
							if($scope.mytrips[i].STATUS === 'CA')
								$scope.mytrips[i].STATUS = "Cancelled";
							if($scope.mytrips[i].STATUS === 'E')
								$scope.mytrips[i].STATUS = "Completed";
							if($scope.mytrips[i].STATUS === 'CR')
								$scope.mytrips[i].STATUS = "Created";
							if($scope.mytrips[i].STATUS === 'S')
								$scope.mytrips[i].STATUS = "Started";
							console.log($scope.mytrips[i].STATUS);
							}
//						console.log($scope.mytrips[0].STATUS);
//						if($scope.mytrips.STATUS === 'CA')
//							$scope.ride_status = "Cancelled";
//						if($scope.mytrips.STATUS === 'E')
//							$scope.ride_status = "Completed";
					}
					else {
						console.log("Error in getting value");
					}
				}).error(function(error) {
					console.log("Error in getting value");
				});
		
			 
			 $scope.toggleMyTrips = function(){
				 $scope.TripDetails = $scope.TripDetails === false ? true: false;
			 };
			 
			 
			 
		  };

	
});	
