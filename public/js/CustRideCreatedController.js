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


UberPrototypeCustomer.controller('CustRideCreatedController' ,function($scope,$http,$location,$window){
	 
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
		        } else {
		            console.log("Unable to find the distance via road.");
		        }
		    });
	 };
	
	 
	 $scope.getPageData = function(){
		// $window.localStorage.clear();
		 console.log("chalo "+RideStatus)
		 console.log("inside init func");
		 $scope.editRide = false;
		 $scope.canceled = false;
		 $scope.rideStarted = false;
//		 $window.localStorage.category = "C";
		 
		 if($window.localStorage.category.localeCompare("C") == 0){
			 $scope.rideId = $window.localStorage.rideId;
			 RideStatus = setInterval(function(){ getRideStatus() }, 5000);
			// clearInterval(RideStatus);
			 $scope.source = $window.localStorage.pickup_address;
			 $scope.destination = $window.localStorage.dropoff_address;
			// var directionsService = new google.maps.DirectionsService();
			 
			 getTimeDest();
		 }
		 
		 if($window.localStorage.category.localeCompare("D") == 0){			 
			 $http({
					method : "GET",
					url : '/getRideCreated',
					params : {
						//"driver_id" : $scope.driverId
						"driver_id" : $window.localStorage.driverId
					}
				}).success(function(data) {
					//checking the response data for statusCode
					if (data.code == 200) {
						if(data.value.length>0){
							$scope.rideStarted = true;
							//console.log("pickup " + data.value.pickup_location);
							console.log("array " + data.value[0].PICKUP_LOCATION);
							$scope.rideId = data.value[0].ROW_ID;
							$window.localStorage.rideId = data.value[0].ROW_ID;//Added newly
							$scope.customerName = data.value[0].FIRST_NAME + " " + data.value[0].LAST_NAME;
							$window.localStorage.custName = $scope.customerName;
							$window.localStorage.customerId = data.value[0].CUSTOMER_ID;
							$window.localStorage.pickup_address = data.value[0].PICKUP_LOCATION;
							$window.localStorage.dropoff_address = data.value[0].DROPOFF_LOCATION;
							$scope.source = $window.localStorage.pickup_address;
							$scope.destination = $window.localStorage.dropoff_address;
							// var directionsService = new google.maps.DirectionsService();
							RideStatus = setInterval(function(){ getRideStatus() }, 5000);
							 //clearInterval(RideStatus);
							 getTimeDest();
							 $http({
									method : "GET",
									url : '/getCustomerRating',
									params : {
										//"driver_id" : $scope.driverId
										"customerId" : $window.localStorage.customerId
									}
								}).success(function(data) {
									//checking the response data for statusCode
									$scope.reviews = [];
									console.log("rating of customer "+JSON.stringify(data));
									if (data.code == 200) {
										$scope.custRating = data.rating.toFixed(1);
											for(var i=0;i<data.customerReviews.length;i++){
												console.log(data.customerReviews[i] + " one");
												$scope.reviews.push(data.customerReviews[i]);
												if(i>4){
													break;
												}
											}
									}
									else{
										console.log("Error in retrieving the customer rating");
									}
								}).error(function(error) {
									console.log("Error in retrieving the customer rating");
								});
						}
						
					}
					else{
						console.log("Error in starting the ride");
					}
				}).error(function(error) {
					console.log("Error in starting the ride");
				});
		 }
		 
 };
	 
	 $scope.getNewRoute = function(){
		 var newdropoff_lat,newdropoff_lng;
		 $scope.destination = document.getElementById("destLocation").value;
		 $window.localStorage.dropoff_address = $scope.destination;
		 var dropoff_location = $window.localStorage.dropoff_address;
		 getTimeDest();
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
										console.log("new time and distance "+ $window.localStorage.time.split(" ",1) + " " +$window.localStorage.distance);
										$http({
											method : "POST",
											url : '/editRide',
											data : {
												"newdropoffLat" : $scope.dropoffLat,
												"newdropoffLng" : $scope.dropoffLng,
												"newdropoff_location": $window.localStorage.dropoff_address,
												"ride_id" : $window.localStorage.rideId,
												"total_time" : $window.localStorage.time.split(" ",1),
												"distance_covered" : $window.localStorage.distance
											}
										}).success(function(data) {
											//checking the response data for statusCode
											if (data.code == 200) {
												$scope.rideStarted = true;
												//getTimeDest();
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
	 
	 $scope.cancelTheRide = function(){
		 $http({
				method : "POST",
				url : '/cancelRide',
				data : {
					"ride_id" : $window.localStorage.rideId,//changed
					"driver_id" : $window.localStorage.driverId
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.code == 200) {
					$scope.canceled = true;
					$scope.rideStarted = false;
				}
				else{
					console.log("Error in cancelling the ride");
				}
			}).error(function(error) {
				console.log("Error in cancelling the ride");
			});
	 };
	 $scope.startTheRide = function(){
		 $http({
				method : "POST",
				url : '/startRide',
				data : {
					"ride_id" : $window.localStorage.rideId//changed
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.code == 200) {
					$location.path('/DriverRideStarted'); 
				}
				else{
					console.log("Error in starting the ride");
				}
			}).error(function(error) {
				console.log("Error in starting the ride");
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
					console.log("data " +JSON.stringify(data));
					if (data.value[0].STATUS == "S"){
						if($window.localStorage.category.localeCompare("C") == 0){
							/*if (RideStatus != null){
								clearInterval(RideStatus);
								RideStatus == null;
							}*/
							clearInterval(RideStatus);
							$location.path('/CustomerRideStarted'); 
						}
						
					}else if(data.value[0].STATUS == "CA"){
						/*if (RideStatus != null){
							clearInterval(RideStatus);
							RideStatus == null;
						}*/
						clearInterval(RideStatus);
						$scope.canceled = true;
						$scope.rideStarted = false;
					}
				}
				else{
					console.log("The ride not started or canceled yet");
					/*if (RideStatus != null){
						clearInterval(RideStatus);
						RideStatus == null;
					}*/
					clearInterval(RideStatus);
				}
			}).error(function(error) {
				console.log("The ride not started or canceled yet");
				/*if (RideStatus != null){
					clearInterval(RideStatus);
					RideStatus == null;
				}*/
				clearInterval(RideStatus);
			});
	 };
});