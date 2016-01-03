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



UberPrototypeCustomer.controller('CustomerController',function($scope,$http,$location,$window,$sce){
	 $scope.curuser = {};
	 
	 $scope.initData = function(){
		 console.log("The Current Customer is " + JSON.stringify($scope.curuser));
		 $window.localStorage.customerId =  $scope.curuser.ROW_ID;
		 $window.localStorage.creCard = $scope.curuser.CREDIT_CARD_ID;
		 $window.localStorage.custName = $scope.curuser.FIRST_NAME + " " + $scope.curuser.LAST_NAME;
		 $window.localStorage.category ="C";
	 }
	$http.get('http://localhost:3000/CustomerEditProfile').success(function(data) {
		//checking the response data for statusCode
		if (data.statusCode == 401) {
		}
		else
			{
			$scope.profile = data;
			}
	}).error(function(error) {
		$scope.invalid_login = true;
	});
	
	$scope.editProfile = function(firstName,lastName,city,zip,email,password,phoneNumber) {
		$http({
			method : "POST",
			url : '/updateProfile',
			data: {	
				"firstName" : firstName,
				"lastName" : lastName,
				"city" : city,
				"zip" : zip,
				"email" : email,
				"phoneNumber" : phoneNumber,
				"password" : password,
				  }
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
			}
			else if(data.statusCode==402)
				{
				alert(data.errorMessage);
				}
			else{
				console.log("after everything checking if i made it here");
				//Making a get call to the '/about' API
				window.location.assign('/customerLoginPage');
			}
		}).error(function(error) {
			$scope.invalid_login = true;
		});
	};
	
	$scope.routeToTemplate = function(routepath){
		 $location.path(routepath); 
	 };
	 
	 $scope.logout = function()
	 {
		 $http.get('http://localhost:3000/Log_Out').success(function(data) {
				//checking the response data for statusCode
				window.location.assign("/"); 
			}).error(function(error) {
				$scope.invalid_login = true;
			});
	 }
	 
	 $scope.initBookaRide = function(){
		 $scope.src;
		 $scope.dest;
		 $scope.HideFareEstimate = true;
		 $scope.hideinvaliddestination = true;
		 $scope.hideinvalidsource = true;
	 };
	 
	 $scope.FareEstimate = function(){	
		 
		    var directionsService = new google.maps.DirectionsService();
		    var source = $scope.source;
		    var destination = $scope.destination;
		    
		    $window.localStorage.pickup_address = $scope.source;
			$window.localStorage.dropoff_address = $scope.destination;
		 
		    var request = {
		        origin: $scope.source,
		        destination: $scope.destination,
		        travelMode: google.maps.TravelMode.DRIVING
		    };
		    //Calculate distance and time needed to travel form source to destination
		    var service = new google.maps.DistanceMatrixService();
		    service.getDistanceMatrix({
		        origins: [source],
		        destinations: [destination],
		        travelMode: google.maps.TravelMode.DRIVING,
		        unitSystem: google.maps.UnitSystem.METRIC,
		        avoidHighways: false,
		        avoidTolls: false
		    }, function (response, status) {
		        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
		            $scope.distance = response.rows[0].elements[0].distance.text;
		            $scope.time = response.rows[0].elements[0].duration.text;
		            
		            $scope.distance = $scope.distance.split(" ",1);
		            $scope.distance = $scope.distance * 0.62;
		            $scope.distance = Math.round($scope.distance, -2);
		            $scope.time = $scope.time.split(" ",1);
		            $scope.time = Number($scope.time);
		            $window.localStorage.distance = $scope.distance;
		            $window.localStorage.time = $scope.time;
		        } else {
		            console.log("Unable to find the distance via road.");
		        }
		    });
		    
		    var pickupLat, pickupLng, dropoffLat, dropoffLng;
		    
		    var pickup_location = $scope.source;
			var dropoff_location = $scope.destination;
			
			
			geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address' : pickup_location},
							function(results, status)
							{
								if (status == google.maps.GeocoderStatus.OK) 
								{
									pickupLat = results[0].geometry.location.lat();
									pickupLng = results[0].geometry.location.lng();
								}

								geocoder.geocode({'address' : dropoff_location},
												function(results,status) 
												{
													if (status == google.maps.GeocoderStatus.OK) 
													{
														dropoffLat = results[0].geometry.location.lat();
														dropoffLng = results[0].geometry.location.lng();
														var latlng = {lat : parseFloat(pickupLat),lng : parseFloat(pickupLng)};
														geocoder.geocode({'location' : latlng},function(pickupaddress,status)
																{if (status === google.maps.GeocoderStatus.OK) 
																{
																				var latlng = {lat : parseFloat(dropoffLat),lng : parseFloat(dropoffLng)};
																				geocoder.geocode({'location' : latlng},function(dropoffaddress,status) 
																						{
																							if (status === google.maps.GeocoderStatus.OK) 
																							{ 		
																									
																									$window.localStorage.pickupLat = pickupLat;
																									$window.localStorage.pickupLng = pickupLng;
																									$window.localStorage.dropoffLat = dropoffLat;
																									$window.localStorage.dropoffLng = dropoffLng;
																									console.log("time:"+$scope.time);
																									console.log("distance:"+$scope.distance);
																									$http({
																										method : "GET",
																										url : '/getFareEstimate',
																										params : {
																											"distance" : $scope.distance,
																											"time" : $scope.time,
																											"latitude" : $window.localStorage.pickupLat,
																											"longitude" : $window.localStorage.pickupLng
																										}
																									}).success(function(data) {
																										console.log(data.fare);
																										if (data.code == 200) {
																											$scope.fareestimate = Math.round(data.fare, -2);
																										}
																										else {
																											console.log("Error calculating the estimate");
																										}
																									}).error(function(error) {
																										console.log("Error calculating the estimate");
																									});
																									
																									$scope.HideFareEstimate = false;

																							} else {
																								$scope.invaliddestination = "Invalid Destination Address";
																								$scope.hideinvaliddestination = false;
																							}
																						 });

																} else{
																	$scope.invalidsource = "Invalid Source Address";
																	$scope.hideinvalidsource = false;
																}
															});
													}

													else {
														alert("Geocode was not successful for the following reason: "
																+ status);
													}
												});
							});
			
	  };
	  
	  $scope.RequestUberX = function(){
		  $location.path('/RequestUber');
	  };
	  
	  
	  
	  $scope.showAllCooridnates = function() {
		  
		  var pos = { };

		     map = new google.maps.Map(document.getElementById('map'), {
		     center: {lat: 58.602611, lng: -111.269531},
		     zoom: 14,
		     mapTypeId: google.maps.MapTypeId.ROADMAP
		   });

		  var southWest = new google.maps.LatLng(62.255139, -135.263672);
		  var northEast = new google.maps.LatLng(50.478483, -88.066406);
		  var lngSpan = northEast.lng() - southWest.lng();
		  var latSpan = northEast.lat() - southWest.lat();
		  for (var i = 0; i < 1000; i++) {
			    var x = southWest.lat() + latSpan * Math.random();
			    var y = southWest.lng() + lngSpan * Math.random();
			    console.log(x + "," + y); 
		  }
	  }
	

	  $scope.LoadDrivers = function(){
		  
		  //$scope.showAllCooridnates();
		  $scope.DriverDetails = true;
		  $scope.hiddenbutton = true;
		  
		  var pickupLat = Number($window.localStorage.pickupLat);
		  var pickupLng = Number($window.localStorage.pickupLng);
		  var centerpoint = new google.maps.LatLng(pickupLat,pickupLng);
		  
		  geocoder = new google.maps.Geocoder();
		  directionsService = new google.maps.DirectionsService();
		  var pos = { };
		  
		     var map = new google.maps.Map(document.getElementById('map'), {
		     center: {lat:pickupLat,lng:pickupLng},
		     zoom: 14,
		     mapTypeId: google.maps.MapTypeId.ROADMAP
		   });
		     
		   var marker = new google.maps.Marker({
		      position: {lat: pickupLat, lng: pickupLng},
		      map: map
		   });
		   
		   $scope.loadreview = function(data){
			   console.log("inside function");
			    $scope.driverreviews = [];
			    $scope.driverId = driverinfo.DRIVER_ID;
			    $scope.drivername = driverinfo.FIRST_NAME + " " + driverinfo.LAST_NAME;
			    console.log("drivername: "+$scope.drivername);
			    $scope.drivercarmodel = driverinfo.CAR_MODEL;
			    $scope.drivercarcolor = driverinfo.COLOR;
			    $scope.drivercaryear = driverinfo.YEAR;
			    $scope.videourl = "https://www.youtube.com/embed/osUEUEQaPzU";
				//$scope.videourl = $sce.trustAsResourceUrl(driverinfo.VIDEO_URL);
			    $scope.videourl = $sce.trustAsResourceUrl($scope.videourl);
				$scope.driverimg = driverinfo.IMAGE_URL;
				$scope.DriverDetails = false;
				$scope.DriverDetails2 = false;
				console.log("driver id"+driverinfo.DRIVER_ID);
				 $http({
						method : "GET",
						url : '/getDriverRating',
						data : {
							"driverId" : driverinfo.DRIVER_ID
						}
					}).success(function(data) {
						if (data.code == '200') {
							if(data.rating > 0){
								
								$scope.driverrating = Math.round(data.rating, -2)+'/5';
							}
							else {
								$scope.driverrating = 'NA';
								
							}
							if(data.driverReviews.length > 0){
								for(var i =0; i < data.driverReviews.length && i <= 5; i++){
									$scope.driverreviews.push(data.driverReviews[i]);
									
									console.log("reviews "+$scope.driverreviews[i].review);
								}
							}
							else {
								$scope.DriverDetails2 = true;
							}
							console.log("Data:"+JSON.stringify(data));
						}
						else {
							if(data.rating > 0){
								$scope.driverrating = Math.round(data.rating, -2)+'/5';
							}
							else {
								$scope.driverrating = 'NA';
							}
							if(data.driverReviews.length > 0){
								for(var i =0; i < data.driverReviews.length && i <= 5; i++){
									$scope.driverreviews.push(data.driverReviews[i]);
								}
							}
							else {
								$scope.DriverDetails2 = true;
							}
							console.log("Error in retrieving rating");
						}
					}).error(function(error) {
						$scope.driverrating = 'NA';
						
						$scope.DriverDetails2 = true;
						console.log("Error in retrieving rating");
					});
		   };
		  
		     
		   $http({
				method : "POST",
				url : '/showDriverin10Mile',
				data : {
					"latitude" : pickupLat,
					"longitude" : pickupLng
				}
			}).success(function(res) {
				 //driverinfo = res.data;
				 var infoWindow = new google.maps.InfoWindow({
					 content: '<p>Driver : Joey Thomas</p>' +
					    '<p>Rating : 4/5</p>' +
					    '<p>Car Model : Mini Cooper</p>' +
					    '<p>Car Color : Red</p>' +
						'<video controls="" style="width:300px;height:180px;" poster="poster.png">' +
					    '<source src="http://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4" type="video/webm;">' +
					    '<source src="http://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4" type="video/mp4;">' +
					    '</video>'
				    });
				     for (var i = 0, length = res.data.length; i < length; i++) {
							var data = res.data[i];
								latLng = new google.maps.LatLng(data.LATITUDE,data.LONGITUDE);
							// Creating a marker and putting it on the map
							    marker = new google.maps.Marker({
								position: latLng,
								map: map,
							//	title: data.title,
								icon:'../images/car.png'
							});
								// Attaching a click event to the current marker
								google.maps.event.addListener(marker, "click", (function(marker, data) {
							         return function() {
									//infoWindow.setContent(data.toString());
								  //  infoWindow.setContent(sample);
									 driverinfo = data;
									 console.log("driver id"+driverinfo.driverid);
								     //infoWindow.open(map, marker);
									//$scope.loadreview(data);
									 document.getElementById('clickme').click();
								}
							})(marker, data));
						}
			}).error(function(error) {
				console.log("Error calculating the estimate");
			});
		   
		   
			
		   $scope.createRide = function(){
			   var pickupLat = $window.localStorage.pickupLat;
			   var pickupLng = $window.localStorage.pickupLng;
			   var dropoffLat = $window.localStorage.dropoffLat;
			   var dropoffLng = $window.localStorage.dropoffLng;
			   $window.localStorage.driverId = $scope.driverId;
			   $window.localStorage.category ="C";
			   
			   console.log(pickupLat);
			   console.log(pickupLng);
			   console.log(dropoffLat);
			   console.log(dropoffLng);
			   console.log($window.localStorage.driverId);
			   console.log($window.localStorage.customerId);
			   
			   $http({
					method : "POST",
					url : '/createRide',
					data : {
						"pickup_address" : $window.localStorage.pickup_address,
						"dropoff_address" : $window.localStorage.dropoff_address,
						"customer_id" : $window.localStorage.customerId,
						"driver_id" : $window.localStorage.driverId,
						"pickupLat" : pickupLat,
						"pickupLng" : pickupLng,
						"dropoffLat" : dropoffLat,
						"dropoffLng" : dropoffLng,
						"distance_covered" : $window.localStorage.distance,
						"total_time" : $window.localStorage.time
					}
				}).success(function(data) {
					if (data.code == 200) {
						console.log("ride id"+data.value);
						$window.localStorage.rideId = data.value;
						//neha put ur routing here
						$scope.routeToTemplate('/CustomerRideCreated');
					}
					else {
						console.log("Error in creating ride");
					}
				}).error(function(error) {
					console.log("Error in creating ride");
				});
			   
		   };
		     //hardcoding driver current location  37.3427555  -121.87057349999998
		/*     var res = [
		                {
		                	"lat":37.3427553,
		                	"lng":-121.87057349999999,
		                	"desc":0001,
		                	"title":"driver1"
		                },
		                
		                {
		                	"lat":37.3427553,
		                	"lng":-121.87057349999998,
		                	"desc":0002,
		                	"title":"driver2"
		                },
		                
		                {
		                	"lat":37.3333552,
		                	"lng":-121.88453520000002,
		                	"desc":0003,
		                	"title":"driver3"
		                },
		                
		                {
		                	"lat":37.3290044,
		                	"lng":-121.90548669999998,
		                	"desc":0004,
		                	"title":"driver4"
		                }
		                
		                ]*/
	  };
	  
	  $scope.initMyTrips = function(){
		  console.log("Current Customer is " + $window.localStorage.customerId);
		 $scope.TripDetails = true;
		 $http({
				method : "GET",
				url : '/getCustomerTripSummary',
				params : {
					"customer_id" :$window.localStorage.customerId
				}
			}).success(function(data) {
				if (data.code == 200) {
					$scope.mytrips = data.value;
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
	  
	  $scope.initCustomerPayment = function(){
		  var months = {
				    January: 1,
				    February: 2,
				    March: 3,
				    April: 4,
				    May: 5,
				    June: 6,
				    July: 7,
				    August: 8,
				    September: 9,
				    October: 10,
				    November: 11,
				    December: 12
				};
		  console.log("CRECard"+$window.localStorage.creCard);
		  $http({
				method : "GET",
				url : '/getCreditCardInfo',
				params : {
					"creCard" :$window.localStorage.creCard
				}
			}).success(function(data) {
				if (data.code == "200") {
					$scope.crecardnum = data.value[0].CRECARDNUM;
					cremonth = data.value[0].MONTH;
					creyear = data.value[0].YEAR;
					
					cremonth = months[cremonth];
					
					$scope.credate = cremonth+"\\"+creyear;
					console.log("credate "+$scope.credate);
				}
				else {
					console.log("Error in getting value");
				}
			}).error(function(error) {
				console.log("Error in getting value");
			});
		  
	  };

$scope.getCurrentTripStatus = function(){
		  console.log("inside getCurrentTrips");
		  $http({
				method : "GET",
				url : '/getCustomerOngoingRides',
				params : {
					"customer_id" : $window.localStorage.customerId
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.code == 200) {
					  $window.localStorage.rideId = data.value[0].RIDE_ID;
					  $window.localStorage.pickup_address = data.value[0].SOURCE;
					  $window.localStorage.dropoff_address = data.value[0].DESTINATION;
					  $window.localStorage.driverId = data.value[0].DRIVER_ID;
					  $window.localStorage.rideStatus = data.value[0].STATUS;
					  
					  console.log("checking" +$window.localStorage.rideId);
					  
					  if ($window.localStorage.rideStatus == "CR"){
						  $scope.routeToTemplate('/CustomerRideCreated');
					  }else if ($window.localStorage.rideStatus == "S"){
						  $scope.routeToTemplate('/CustomerRideStarted');
					  }else if ($window.localStorage.rideStatus == "E"){
						  $scope.routeToTemplate('/CustomerBillSummary');
					  }else{
						  console.log("No Ongoing Rides!!");
					  }
				}
				else{
					console.log("Error in retrieving the ongoing trips");
				}
			}).error(function(error) {
				console.log("Error in retrieving the ongoing trips");
			});
	  };

});

