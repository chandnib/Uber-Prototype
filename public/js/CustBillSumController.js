UberPrototypeCustomer.controller('CustBillSumController' ,function($scope,$http,$location,$window){
	
	$scope.getPageData = function(){
		
		$scope.customerName = $window.localStorage.custName;
		$scope.driverName = $window.localStorage.driverName;
		
		$scope.ratingValue = null;
		 console.log("inside init func of CustBillSumController");
		 $scope.source = $window.localStorage.pickup_address;
		 $scope.destination = $window.localStorage.dropoff_address;
		 $/*scope.pickupLocation = $window.localStorage.pickup_address;
			$scope.dropoffLocation = $window.localStorage.dropoff_address;*/
			$scope.tripDate = Date().substring(0, 15);
			$scope.distance = $window.localStorage.distance;
            $scope.duration = $window.localStorage.time;
		 
		 $http({
				method : "GET",
				url : '/getBillSummary',
				params : {
					//"rideId" : $scope.rideId,
					"rideId" : $window.localStorage.rideId,
					"distance" : $window.localStorage.distance.split(" ",1),
					"time" : $window.localStorage.time.split(" ",1)
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.code == 200) {
					console.log("data"+JSON.stringify(data));
					$scope.pickupLocation = data.value[0].SOURCE_LOCATION;
					$scope.dropoffLocation = data.value[0].DESTINATION_LOCATION;
					$scope.amount = data.value[0].BILL_AMOUNT.toFixed(2);
					$scope.baseFare = data.value[0].BASE_FARE.toFixed(2);
					$scope.timeFare = data.value[0].TIME_FARE.toFixed(2);
					$scope.distfare = data.value[0].DISTANCE_FARE.toFixed(2);
					$scope.speed = ($scope.distance.split(" ",1)/$scope.duration.split(" ",1)).toFixed(2);
					//$location.path('/CustomerBillSummary'); 
				}
				else{
					//Making a get call to the '/CustomerBillSummary' page
					console.log("Error in updating the destination location");
				}
			}).error(function(error) {
				console.log("Error in updating the destination location");
			});
		    
	 };
	 
	 $(document).ready(function() {
		    
		 $(function() {
		     $('input[name="rating"]').change(function() {
		         $scope.ratingValue = this.value;
		        console.log("rating" +$scope.ratingValue);
		     })

		 });
		 });
	 
	 $scope.postRiderReview = function(){
		 $scope.reviewComments = null;
		 var postedRiderReview = $scope.reviewRiderTextArea;
		 
		 $http({
				method : "POST",
				url : '/saveCustomerRating',
				data : {
					//"rideId" : $scope.rideId,
					"rideId" : $window.localStorage.rideId,
					"customerId" : $window.localStorage.customerId,
					"driverId" : $window.localStorage.driverId,
					"rating" : $scope.ratingValue,
					"review" : postedRiderReview
				}
			}).success(function(data) {
				//checking the response data for statusCode
				console.log("data " + JSON.stringify(data));
				if (data.code == 200) {
					$scope.reviewComments = "Reviews Posted Successfully!";
				}
				else{
					console.log("Error in updating the review comments");
				}
			}).error(function(error) {
				console.log("Error in updating the review comments");
			});
	 };
	 
	 $scope.postDriverReview = function(){
		 $scope.reviewComment = null;
		 var postedDriverReview = $scope.reviewDriverTextArea;
		 
		 $http({
				method : "POST",
				url : '/saveDriverRating',
				data : {
					//"rideId" : $scope.rideId,
					"rideId" : $window.localStorage.rideId,
					"customerId" : $window.localStorage.customerId,
					"driverId" : $window.localStorage.driverId,
					"rating" : $scope.ratingValue,
					"review" : postedDriverReview
				}
			}).success(function(data) {
				//checking the response data for statusCode
				console.log("data " + JSON.stringify(data));
				if (data.code == 200) {
					$scope.reviewComment = "Reviews Posted Successfully!";
				}
				else{
					console.log("Error in updating the review comments");
				}
			}).error(function(error) {
				console.log("Error in updating the review comments");
			});
	 };
});