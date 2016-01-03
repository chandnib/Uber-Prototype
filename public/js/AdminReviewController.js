UberPrototypeAdmin.directive('googlearea', function() {
	//directive for Google Auto complete option for source
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.ara = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.ara, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

UberPrototypeAdmin.controller('AdminReviewController',function($scope,$http,$location,$window,$routeParams){
	$scope.detailview = {};
	$scope.customers ={};
	$scope.drivers = {};
	$scope.profile = {};
	$scope.driverInfo = {};
	$scope.curuser = {};



	//Admin Detail Review Controller
	$scope.loadDriverDetail = function(){
		$scope.driverInfo = {};
		$scope.detailview.driverid = $routeParams.driverid;
		console.log("Driver id after navigating to the Page!!! " + $routeParams.driverid);
		$http({
			method: 'POST',
			url: '/loadDriverDetail',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({'ROW_ID' : $routeParams.driverid})
		}).then(function successCallback(response) {
			$scope.driverInfo = response.data[0];
			console.log("loadCustomerDetail ==> Response from Server ++ " + JSON.stringify($scope.driverInfo));	
		}, function errorCallback(response) {
			$scope.driverInfo.errorMessage = "There was an error retrieving the Customer Accounts Details";
			$scope.driverInfo.error = true;
			console.log("customers Error In request" + JSON.stringify(response));		
		});
	};

	
	
	$scope.loadCustomerDetail = function(){
		$scope.profile = {};
		$scope.detailview.customerid = $routeParams.custid;
		console.log("Customer id after navigating to the Page!!! " + $routeParams.custid);
		$http({
			method: 'POST',
			url: '/loadCustomerDetail',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({'ROW_ID' : $routeParams.custid})
		}).then(function successCallback(response) {
			$scope.profile = response.data[0];
			//console.log("loadCustomerDetail ==> Response from Server ++ " + JSON.stringify($scope.profile));	
		}, function errorCallback(response) {
			$scope.profile.errorMessage = "There was an error retrieving the Customer Accounts Details";
			$scope.profile.error = true;
			console.log("customers Error In request" + JSON.stringify(response));		
		});
	};
	
	$scope.currentRow = 0;
	$scope.customers = [];

	//Customer Admin Operations
	$scope.loadUnverifiedCustomers = function(){
		$scope.customers.errorMessage = "";
		$scope.customers.error = false;
		console.log("loadUnverifiedCustomers==>");
		$http({
			method: 'POST',
			url: '/loadUnverifiedCustomers',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({currentRow:$scope.currentRow})
		}).then(function successCallback(response) {
			for(var i in response.data){
				$scope.customers.push(response.data[i]) ;
			}
			//console.log("loadUnverifiedCustomers ==> Response from Server ++ " + JSON.stringify($scope.customers));	
		}, function errorCallback(response) {
			$scope.customers.errorMessage = "There was an error retrieving the Customer Accounts";
			$scope.customers.error = true;
			//console.log("customers Error In request" + JSON.stringify(response));		
		});
	};
	
	$scope.loadMoreCustomers = function(){
		$scope.currentRow += 100;
		$scope.loadUnverifiedCustomers();
	}


	$scope.approveCustomer = function(customer){
		console.log("approveCustomer ==> ");
		$http({
			method: 'POST',
			url: '/approveCustomer',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(customer)
		}).then(function successCallback(response) {
			//$scope.customers = response.data;
			console.log("approveCustomer ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedCustomers();
		}, function errorCallback(response) {
			console.log("approveCustomer Error In request" + JSON.stringify(response));		
		});
	};

	$scope.rejectCustomer = function(customer){
		console.log("rejectCustomer ==> ");
		$http({
			method: 'POST',
			url: '/rejectCustomer',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(customer)
		}).then(function successCallback(response) {
			//$scope.customers = response.data;
			console.log("approveCustomer ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedCustomers();
		}, function errorCallback(response) {
			console.log("approveCustomer Error In request" + JSON.stringify(response));		
		});
	};

	$scope.approveAllCustomer = function(){
		console.log("approveAllCustomer ==> ");
		$http({
			method: 'POST',
			url: '/approveAllCustomer',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {}
		}).then(function successCallback(response) {
			console.log("approveAllCustomer ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedCustomers();
		}, function errorCallback(response) {
			console.log("approveAllCustomer Error In request" + JSON.stringify(response));		
		});
	};

	$scope.rejectAllCustomer = function(){
		console.log("rejectAllCustomer() ==> ");
		$http({
			method: 'POST',
			url: '/rejectAllCustomer',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {}
		}).then(function successCallback(response) {
			console.log("rejectAllCustomer ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedCustomers();
		}, function errorCallback(response) {
			console.log("rejectAllCustomer Error In request" + JSON.stringify(response));		
		});
	};
	
	$scope.currentDriverRow = 0;
	$scope.drivers = [];

	//Driver Admin Operations
	$scope.loadUnverifiedDrivers = function(){
		$scope.drivers.errorMessage = "";
		$scope.drivers.error = false;
		console.log("loadUnverifiedDrivers==>");
		$http({
			method: 'POST',
			url: '/loadUnverifiedDrivers',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({currentDriverRow:$scope.currentDriverRow})
		}).then(function successCallback(response) {
			for(var i in response.data){
				$scope.drivers.push(response.data[i]) ;
			}
			//$scope.drivers = response.data;
			//console.log("loadUnverifiedDrivers ==> Response from Server ++ " + JSON.stringify($scope.drivers));	
		}, function errorCallback(response) {
			$scope.drivers.errorMessage = "There was an error retrieving the Driver Accounts";
			$scope.drivers.error = true;
			//console.log("drivers Error In request" + JSON.stringify(response));		
		});
	};
	
	$scope.loadMoreDrivers= function(){
		$scope.currentDriverRow += 100;
		$scope.loadUnverifiedDrivers();
	}

	$scope.approveDriver = function(customer){
		console.log("approveDriver ==> ");
		$http({
			method: 'POST',
			url: '/approveDriver',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(customer)
		}).then(function successCallback(response) {
			//$scope.drivers = response.data;
			console.log("approveDriver ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedDrivers();
		}, function errorCallback(response) {
			console.log("approveDriver Error In request" + JSON.stringify(response));		
		});
	};

	$scope.rejectDriver = function(customer){
		console.log("rejectDriver ==> ");
		$http({
			method: 'POST',
			url: '/rejectDriver',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(customer)
		}).then(function successCallback(response) {
			//$scope.drivers = response.data;
			console.log("approveDriver ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedDrivers();
		}, function errorCallback(response) {
			console.log("approveDriver Error In request" + JSON.stringify(response));		
		});
	};

	$scope.approveAllDriver = function(){
		console.log("approveAllDriver ==> ");
		$http({
			method: 'POST',
			url: '/approveAllDriver',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {}
		}).then(function successCallback(response) {
			console.log("approveAllDriver ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedDrivers();
		}, function errorCallback(response) {
			console.log("approveAllDriver Error In request" + JSON.stringify(response));		
		});
	};

	$scope.rejectAllDriver = function(){
		console.log("rejectAllDriver() ==> ");
		$http({
			method: 'POST',
			url: '/rejectAllDriver',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {}
		}).then(function successCallback(response) {
			console.log("rejectAllDriver ==> Response from Server ++ " + JSON.stringify(response.data));
			//$scope.loadUnverifiedDrivers();
		}, function errorCallback(response) {
			console.log("rejectAllDriver Error In request" + JSON.stringify(response));		
		});
	};

	$scope.logout = function()
	{

		$http({
			method: 'GET',
			url: '/Log_Out'
		}).then(function successCallback(response) {
			console.log("Logout Sucessfull!!");
			window.location.assign("/"); 
		}, function errorCallback(response) {
			console.log("Error in Logging Out !!!" + response)	
		});
	};




	$scope.routeToTemplate = function(routepath){
		$location.path(routepath); 
	};
	
	
	$scope.initRideStatistics = function(){
		$scope.hideinvaliddate = true;
		$scope.ara;
		var directionsService = new google.maps.DirectionsService();
	};
	$scope.CancelRideStatistics = function(){
		$scope.startdate = "";
		$scope.enddate = "";
		$scope.area = "";
	};
	$scope.RideStatistics = function(){
		
		var directionsService = new google.maps.DirectionsService();
	    var pickup_location = $scope.area;
		var startdate = $scope.startdate;
		var enddate = $scope.enddate;
		
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({'address' : pickup_location},
						function(results, status)
						{
							if (status == google.maps.GeocoderStatus.OK) 
							{
								pickupLat = results[0].geometry.location.lat();
								pickupLng = results[0].geometry.location.lng();
								
								$http({
									method : "POST",
									url : '/revenueStats',
									data : {
										"lat" : pickupLat,
										"long" : pickupLng,
										"startdate" :startdate,
										"enddate" : enddate
									}
								}).success(function(res) {
									if (res.code == 200) {
										
										var chart1 = {};
									    chart1.type = "BarChart";
									    chart1.cssStyle = "height:400px; width:550px;";
									    
									    switch(res.data.length) {
									    case 1:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]}
							                                    ]};
									        break;
									    case 2:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].BILL},
								                                    ]}
							                                    ]};
									        break;
									    case 3:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].BILL},
								                                    ]}
							                                    ]};
									        break;
									    case 4:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].BILL},
								                                    ]}
							                                    ]};
									        break;
									    case 5:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[4].RDATE},
								                                            {v: res.data[4].BILL},
								                                    ]}
							                                    ]};
									        break;
									    case 6:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[4].RDATE},
								                                            {v: res.data[4].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[5].RDATE},
								                                            {v: res.data[5].BILL},
								                                    ]}
							                                    ]};
									        break;
									    case 7:
									    	chart1.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "Revenue/day", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].BILL},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[4].RDATE},
								                                            {v: res.data[4].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[5].RDATE},
								                                            {v: res.data[5].BILL},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[6].RDATE},
								                                            {v: res.data[6].BILL},
								                                    ]}
							                                    ]};
									        break;
									    default:
									    	console.log("No data to load");
									    }
									    
									    console.log("chart data: "+JSON.stringify(chart1.data));

									    chart1.options = {
									        "title": "Ride Statistics",
									        "isStacked": "true",
									        "fill": 20,
									        "bar": {groupWidth: "25%"},
									        "displayExactValues": true,
									        "vAxis": {
									            "title": "Date", "gridlines": {"count": 6}
									        },
									        "hAxis": {
									            "title": "Revenue/day"
									        }
									    };

									    chart1.formatters = {};

									    $scope.chart = chart1;
									    
									    
									    var chart2 = {};
									    chart2.type = "BarChart";
									    chart2.cssStyle = "height:400px; width:550px;";
									    
									    switch(res.data.length) {
									    case 1:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]}
							                                    ]};
									        break;
									    case 2:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].RIDE},
								                                    ]}
							                                    ]};
									        break;
									    case 3:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].RIDE},
								                                    ]}
							                                    ]};
									        break;
									    case 4:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].RIDE},
								                                    ]}
							                                    ]};
									        break;
									    case 5:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[4].RDATE},
								                                            {v: res.data[4].RIDE},
								                                    ]}
							                                    ]};
									        break;
									    case 6:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[4].RDATE},
								                                            {v: res.data[4].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[5].RDATE},
								                                            {v: res.data[5].RIDE},
								                                    ]}
							                                    ]};
									        break;
									    case 7:
									    	chart2.data = {"cols": [
							                                        {id: "t", label: "Date", type: "string"},
							                                        {id: "s", label: "TotalRides/Area", type: "number"}
							                                    ], "rows": [
							                                        {c: [
							                                            {v: res.data[0].RDATE},
							                                            {v: res.data[0].RIDE},
							                                        ]},
							                                        {c: [
								                                            {v: res.data[1].RDATE},
								                                            {v: res.data[1].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[2].RDATE},
								                                            {v: res.data[2].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[3].RDATE},
								                                            {v: res.data[3].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[4].RDATE},
								                                            {v: res.data[4].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[5].RDATE},
								                                            {v: res.data[5].RIDE},
								                                    ]},
								                                    {c: [
								                                            {v: res.data[6].RDATE},
								                                            {v: res.data[6].RIDE},
								                                    ]}
							                                    ]};
									        break;
									    default:
									    	console.log("No data to load");
									    }
									    
									    console.log("chart data: "+JSON.stringify(chart2.data));

									    chart2.options = {
									        "title": "Ride Statistics",
									        "isStacked": "true",
									        "fill": 20,
									        "bar": {groupWidth: "25%"},
									        "displayExactValues": true,
									        "vAxis": {
									            "title": "Date", "gridlines": {"count": 6}
									        },
									        "hAxis": {
									            "title": "TotalRides/Area"
									        }
									    };

									    chart2.formatters = {};

									    $scope.charttot = chart2;
									    
									    $scope.hideinvaliddate = false;
										
										
									}
									else {
										console.log("Error in getting statistics");
									}
								}).error(function(error) {
									console.log("Error in getting statistics: ERROR");
								});
							   
							}

							else {
								console.log("Error in retriving Lat and Long");
							}
						});
	};
	
	

	$scope.initRideGraphs = function(){
		$scope.hideinvaliddate1 = true;
		$scope.ara;
		var directionsService = new google.maps.DirectionsService();
	};
	$scope.CancelRideGraphs = function(){
		$scope.Customerid = "";
		$scope.Driverid = "";
		$scope.area1 = "";
		$scope.datereq = "";
		$scope.datereq1 = "";
	};
	$scope.RideGraphs = function(){
		
		var directionsService = new google.maps.DirectionsService();
	    var pickup_location = $scope.area1;
		var startdate = $scope.datereq;
		var enddate = $scope.datereq1;
		var Customerid = $scope.Customerid;
		var Driverid = $scope.Driverid;
		
		
		if($scope.Customerid == undefined || $scope.Customerid == ""){
			geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address' : pickup_location},
							function(results, status)
							{
								console.log("end date: "+enddate);	
								if (status == google.maps.GeocoderStatus.OK) 
								{
									pickupLat = results[0].geometry.location.lat();
									pickupLng = results[0].geometry.location.lng();
									
									$http({
										method : "POST",
										url : '/totalrideStats',
										data : {
											"lat" : pickupLat,
											"long" : pickupLng,
											"startdate" :startdate,
											"enddate" : enddate
										}
									}).success(function(res) {
										if (res.code == 200) {
											//setup google chart here
											console.log(JSON.stringify(res.data));
											$scope.totride = Number(res.data[0].AREACOUNT);
											console.log("$scope.totride: "+$scope.totride);
											$http({
												method : "POST",
												url : '/driverrideStats',
												data : {
													"lat" : pickupLat,
													"long" : pickupLng,
													"startdate" :startdate,
													"enddate" : enddate,
													"Driverid" : Driverid
												}
											}).success(function(res) {
												if (res.code == 200) {
													//setup google chart here
													console.log(JSON.stringify(res.data));
													$scope.driverride = Number(res.data[0].DRIVERCOUNT);
													console.log("$scope.driverride: "+$scope.driverride);
													
													var chart1 = {};
												    chart1.type = "BarChart";
												    chart1.cssStyle = "height:400px; width:550px;";
												    chart1.data = {"cols": [
												                                        {id: "t", label: "Rides Category", type: "string"},
												                                        {id: "s", label: "Total Rides", type: "number"}
												                                    ], "rows": [
												                                        {c: [
												                                            {v: "Rides Areawise"},
												                                            {v: $scope.totride},
												                                        ]},
												                                        {c: [
												                                            {v: "Rides per Driver"},
												                                            {v: $scope.driverride},
												                                        ]}
												                                    ]};
											
												    console.log("chart data: "+JSON.stringify(chart1.data));

												    chart1.options = {
												        "title": "Ride Statistics",
												        "isStacked": "true",
												        "fill": 20,
												        "bar": {groupWidth: "25%"},
												        "displayExactValues": true,
												        "vAxis": {
												            "title": "Ride Category", "gridlines": {"count": 6}
												        },
												        "hAxis": {
												            "title": "Total Rides"
												        }
												    };

												    chart1.formatters = {};

												    $scope.chart = chart1;
												    $scope.hideinvaliddate1 = false;
													
												}
												else {
													console.log("Error in getting statistics");
												}
											}).error(function(error) {
												console.log("Error in getting statistics: ERROR");
											});
										   
										}
										else {
											console.log("Error in getting statistics");
										}
									}).error(function(error) {
										console.log("Error in getting statistics: ERROR");
									});
								}

								else {
									console.log("Error in retriving Lat and Long");
								}
							});
		}
		else if($scope.Driverid == undefined || $scope.Driverid == ""){
			geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address' : pickup_location},
							function(results, status)
							{
								console.log("end date: "+enddate);	
								if (status == google.maps.GeocoderStatus.OK) 
								{
									pickupLat = results[0].geometry.location.lat();
									pickupLng = results[0].geometry.location.lng();
									
									$http({
										method : "POST",
										url : '/totalrideStats',
										data : {
											"lat" : pickupLat,
											"long" : pickupLng,
											"startdate" :startdate,
											"enddate" : enddate
										}
									}).success(function(res) {
										if (res.code == 200) {
											//setup google chart here
											console.log(JSON.stringify(res.data));
											$scope.totride = Number(res.data[0].AREACOUNT);
											console.log("$scope.totride: "+$scope.totride);
											$http({
												method : "POST",
												url : '/cutomerrideStats',
												data : {
													"lat" : pickupLat,
													"long" : pickupLng,
													"startdate" :startdate,
													"enddate" : enddate,
													"Customerid" : Customerid
												}
											}).success(function(res) {
												if (res.code == 200) {
													//setup google chart here
													console.log(JSON.stringify(res.data));
													$scope.custride = Number(res.data[0].CUSTOMERCOUNT);
													
													var chart1 = {};
												    chart1.type = "BarChart";
												    chart1.cssStyle = "height:400px; width:550px;";
												    chart1.data = {"cols": [
												                                        {id: "t", label: "Rides Category", type: "string"},
												                                        {id: "s", label: "Total Rides", type: "number"}
												                                    ], "rows": [
												                                        {c: [
												                                            {v: "Rides Areawise"},
												                                            {v: $scope.totride},
												                                        ]},
												                                        {c: [
												                                            {v: "Rides per Customer"},
												                                            {v: $scope.custride},
												                                        ]}
												                                    ]};
											
												    console.log("chart data: "+JSON.stringify(chart1.data));

												    chart1.options = {
												        "title": "Ride Statistics",
												        "isStacked": "true",
												        "fill": 20,
												        "bar": {groupWidth: "25%"},
												        "displayExactValues": true,
												        "vAxis": {
												            "title": "Ride Category", "gridlines": {"count": 6}
												        },
												        "hAxis": {
												            "title": "Total Rides"
												        }
												    };

												    chart1.formatters = {};

												    $scope.chart = chart1;
												    $scope.hideinvaliddate1 = false;
													
												}
												else {
													console.log("Error in getting statistics");
												}
											}).error(function(error) {
												console.log("Error in getting statistics: ERROR");
											});
										}
										else {
											console.log("Error in getting statistics");
										}
									}).error(function(error) {
										console.log("Error in getting statistics: ERROR");
									});
								   
								}

								else {
									console.log("Error in retriving Lat and Long");
								}
							});
		}else
		{
			geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address' : pickup_location},
							function(results, status)
							{
								console.log("end date: "+enddate);	
								if (status == google.maps.GeocoderStatus.OK) 
								{
									pickupLat = results[0].geometry.location.lat();
									pickupLng = results[0].geometry.location.lng();
									
									$http({
										method : "POST",
										url : '/totalrideStats',
										data : {
											"lat" : pickupLat,
											"long" : pickupLng,
											"startdate" :startdate,
											"enddate" : enddate
										}
									}).success(function(res) {
										if (res.code == 200) {
											//setup google chart here
											console.log(JSON.stringify(res.data));
											$scope.totride = Number(res.data[0].AREACOUNT);
											console.log("$scope.totride: "+$scope.totride);
											$http({
												method : "POST",
												url : '/cutomerrideStats',
												data : {
													"lat" : pickupLat,
													"long" : pickupLng,
													"startdate" :startdate,
													"enddate" : enddate,
													"Customerid" : Customerid
												}
											}).success(function(res) {
												if (res.code == 200) {
													//setup google chart here
													//console.log(JSON.stringify(res.data));
													$scope.custride = Number(res.data[0].CUSTOMERCOUNT);
													console.log("$scope.custride: "+$scope.custride);
													$http({
														method : "POST",
														url : '/driverrideStats',
														data : {
															"lat" : pickupLat,
															"long" : pickupLng,
															"startdate" :startdate,
															"enddate" : enddate,
															"Driverid" : Driverid
														}
													}).success(function(res) {
														if (res.code == 200) {
															//setup google chart here
															console.log(JSON.stringify(res.data));
															$scope.driverride = Number(res.data[0].DRIVERCOUNT);
															console.log("$scope.driverride: "+$scope.driverride);
															
															var chart1 = {};
														    chart1.type = "BarChart";
														    chart1.cssStyle = "height:400px; width:550px;";
														    chart1.data = {"cols": [
														                                        {id: "t", label: "Rides Category", type: "string"},
														                                        {id: "s", label: "Total Rides", type: "number"}
														                                    ], "rows": [
														                                        {c: [
														                                            {v: "Rides Areawise"},
														                                            {v: $scope.totride},
														                                        ]},
														                                        {c: [
														                                            {v: "Rides per Customer"},
														                                            {v: $scope.custride},
														                                        ]},
														                                        {c: [
														                                            {v: "Rides per Driver"},
														                                            {v: $scope.driverride},
														                                        ]}
														                                    ]};
													
														    console.log("chart data: "+JSON.stringify(chart1.data));

														    chart1.options = {
														        "title": "Ride Statistics",
														        "isStacked": "true",
														        "fill": 20,
														        "bar": {groupWidth: "25%"},
														        "displayExactValues": true,
														        "vAxis": {
														            "title": "Ride Category", "gridlines": {"count": 6}
														        },
														        "hAxis": {
														            "title": "Total Rides"
														        }
														    };

														    chart1.formatters = {};

														    $scope.chart = chart1;
														    $scope.hideinvaliddate1 = false;
															
														}
														else {
															console.log("Error in getting statistics");
														}
													}).error(function(error) {
														console.log("Error in getting statistics: ERROR");
													});
												   
												}
												else {
													console.log("Error in getting statistics");
												}
											}).error(function(error) {
												console.log("Error in getting statistics: ERROR");
											});
										}
										else {
											console.log("Error in getting statistics");
										}
									}).error(function(error) {
										console.log("Error in getting statistics: ERROR");
									});
									
								}

								else {
									console.log("Error in retriving Lat and Long");
								}
							});
		}
		
		
		
	};
});