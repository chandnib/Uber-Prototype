UberPrototypeCustomer.directive('googledestination', function() {
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



UberPrototypeCustomer.controller('CustRideStartedController' ,function($scope,$http,$location,$window){
	 
	console.log("inside my controller");
	$scope.src;
	 $scope.dest;
	 var RideStatus;
	 
	 
	 var getTimeDest = function(){
		 console.log("inside time n dist calculation " + $scope.source + $scope.destination);
		    var request = {
		        origin: $window.localStorage.pickup_address,
		        destination: $window.localStorage.dropoff_address,
		        travelMode: google.maps.TravelMode.DRIVING
		    };
		    //Calculate distance and time needed to travel form source to destination
		    var service = new google.maps.DistanceMatrixService();
		    service.getDistanceMatrix({
		        origins: [$window.localStorage.pickup_address],
		        destinations: [$window.localStorage.dropoff_address],
		        travelMode: google.maps.TravelMode.DRIVING,
		        unitSystem: google.maps.UnitSystem.METRIC,
		        avoidHighways: false,
		        avoidTolls: false
		    }, function (response, status) {
		        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
		            $scope.distance = response.rows[0].elements[0].distance.text;
		            $scope.duration = response.rows[0].elements[0].duration.text;
		            
		            var dist = $scope.distance.split(" ",1);
		            dist = dist * 0.62;
		            $scope.distance = dist.toFixed(2)+ " miles";
		            $window.localStorage.distance = dist.toFixed(2);
		            
		            var time = $scope.duration.split(" ",1);
		            $scope.duration = time + " mins";
		            $window.localStorage.time = $scope.duration;
		            console.log("distance : " + $scope.distance);
		            console.log("duration : " + $scope.duration);
		            //$scope.time = $scope.time.split(" ",1);
		        } else {
		            console.log("Unable to find the distance via road.");
		        }
		    });
	 };
	 

	 
	 $scope.getPageData = function(){
		 console.log("inside init func");
		 $scope.editRide = false;
		 $scope.source = $window.localStorage.pickup_address;
		 $scope.destination = $window.localStorage.dropoff_address;
		// var directionsService = new google.maps.DirectionsService();
		 
		 getTimeDest();
		 if($window.localStorage.category.localeCompare("C") == 0){
			 $scope.rideId = $window.localStorage.rideId;
			RideStatus = setInterval(function(){ getRideStatus() }, 5000);
			 //clearInterval(RideStatus);
		 }
		 
		 if($window.localStorage.category.localeCompare("D") == 0){
			 $scope.rideId = $window.localStorage.rideId;
			/*RideStatus = setInterval(function(){ getRideStatus() }, 5000);*/
			 //clearInterval(RideStatus);
		 }
		    
	 };
	 
	 $scope.getNewRoute = function(){
		 var newdropoff_lat,newdropoff_lng;
		 $scope.destination = document.getElementById("destLocation").value;
		 console.log("check "+ document.getElementById("destLocation").value);
		 $window.localStorage.dropoff_address = $scope.destination;
		 getTimeDest();
		 console.log("$scope.destination" + $scope.destination);
		 var dropoff_location = $window.localStorage.dropoff_address;
			geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address' : dropoff_location},
					function(results, status)
					{
						if (status == google.maps.GeocoderStatus.OK) 
						{
							$scope.dropoffLat = results[0].geometry.location.lat();
							$scope.dropoffLng = results[0].geometry.location.lng();
							var latlng = {lat : parseFloat($scope.dropoffLat),lng : parseFloat($scope.dropoffLng)};
							
							geocoder.geocode({'location' : latlng},function(dropoffaddress,status)
									{if (status === google.maps.GeocoderStatus.OK) 
									{
										/*$window.localStorage.dropoff_address = dropoffaddress;
										$window.localStorage.dropoffLat = dropoffLat;
										$window.localStorage.dropoffLng = dropoffLng;*/
										$scope.destPosition = {lat : $scope.dropoffLat,
												lng : $scope.dropoffLng};
										
										$scope.newdropoff_address = dropoffaddress;
										newdropoff_lat = $scope.dropoffLat;
										newdropoff_lng = $scope.dropoffLng;
										console.log(dropoffaddress + $scope.dropoffLat);
										console.log($scope.dropoffLng);
										$http({
											method : "POST",
											url : '/editRide',
											data : {
												"newdropoffLat" : $scope.dropoffLat,
												"newdropoffLng" : $scope.dropoffLng,
												"newdropoff_location": $window.localStorage.dropoff_address,
												"ride_id" :$window.localStorage.rideId, //changed
												"total_time" : $window.localStorage.time.split(" ",1),
												"distance_covered" : $window.localStorage.distance
											}
										}).success(function(data) {
											//checking the response data for statusCode
											if (data.code == 200) {
												//getTimeDest();
												//$scope.isDisabled = false;
											}
											else{
												console.log("Error in updating the destination location");
											}
										}).error(function(error) {
											console.log("Error in updating the destination location");
										});

									} else{
										console.log( "Invalid Destination Address");
									}
								});
						}
					});
	 };
	 
	 $scope.cancelEditRide = function(){
		 $scope.editRide = false;
		 $scope.getPageData();
	 };
	
	 $scope.editTheRide = function(){
		 //$scope.isDisabled = true;
		 $scope.editRide = true;
	 };
	 
	 $scope.endTheRide = function(){
		 console.log("inside ride started controller "+ $window.localStorage.rideId);//chnanged
		 $http({
				method : "POST",
				url : '/endRide',
				data : {
					"ride_id" : $window.localStorage.rideId,//changed
					"driver_id" : $window.localStorage.driverId
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.code == 200) {
					$location.path('/DriverBillSummary'); 
				}
				else{
					console.log("Error in ending the ride");
				}
			}).error(function(error) {
				console.log("Error in ending the ride");
			});
	 };
	 
	 var getRideStatus = function(){
		 $http({
				method : "GET",
				url : '/fetchRideStatus',
				params : {
					"ride_id" : $window.localStorage.rideId//changed
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.code == 200) {
					if (data.value[0].STATUS == "E"){
						/*if (RideStatus != null){
							clearInterval(RideStatus);
							RideStatus == null;
						}*/
						clearInterval(RideStatus);
						$location.path('/CustomerBillSummary'); 
					}
				}
				else{
					//Making a get call to the '/CustomerBillSummary' page
					console.log("The ride not completed yet");
					/*if (RideStatus != null){
						clearInterval(RideStatus);
						RideStatus == null;
					}*/
					clearInterval(RideStatus);
				}
			}).error(function(error) {
				console.log("The ride not completed yet");
				/*if (RideStatus != null){
					clearInterval(RideStatus);
					RideStatus == null;
				}*/
				clearInterval(RideStatus);
			});
	 };
});