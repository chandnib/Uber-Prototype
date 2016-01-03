UberPrototypeAdmin.controller('searchDriverController',function($scope,$http,$location,$window,$routeParams){
	$scope.DriverList = [];
	$scope.searchInitDriver =function(){
		$scope.currentRowDriver=0;
		$scope.loadMoreDriver = false;
	}
     $scope.searchDriver =function(){
    	 console.log($scope);
    	 $http({
				method : "POST",
				url : '/searchDriver',
				headers: {
					'Content-Type': 'application/json'
				},
				data : {
					driverFirstName : $scope.driverFirstName,
					driverLastName : $scope.driverLastName,
					driverCity : $scope.driverCity,
					driverEmailId : $scope.driverEmailId,
					driverPhoneNo : $scope.driverPhoneNo,
					driverSSNId : $scope.driverSSNId,
					currentRow : $scope.currentRowDriver
				}
			}).success(function(data) {
				console.log("data"+JSON.stringify(data));
				//checking the response data for statusCode
				if (data.code == '200') {
					console.log("data"+data.data[0].ROW_ID);
					$scope.DriverList = data.data;
					$scope.showTableDriver=true;
					$scope.loadMoreDriver = true;
					$scope.currentRowDriver = $scope.currentRowDriver + data.data.length;
				}
				else{
					console.log("Error in getting the Drivers");
				}
			}).error(function(error) {
				$scope.showValidDriver=true;
		        $scope.DriverList = null;
			    $scope.showTableDriver=false;
				console.log("Error in getting the Drivers");
			});
     
     };
    

$scope.getMoreDriver = function(){
		 $http({
				method : "POST",
				url : '/searchDriver',
				headers: {
					'Content-Type': 'application/json'
				},
				data : {
					driverFirstName : $scope.driverFirstName,
					driverLastName : $scope.driverLastName,
					driverCity : $scope.driverCity,
					driverEmailId : $scope.driverEmailId,
					driverPhoneNo : $scope.driverPhoneNo,
					driverSSNId : $scope.driverSSNId,
					currentRow : $scope.currentRowDriver
				}
			}).success(function(data) {
			console.log("data"+JSON.stringify(data));
			console.log("data.code"+data.code);
			//checking the response data for statusCode
			if (data.code == '200') {
				console.log("data"+data.data[0].ROW_ID);
				for(i=0;i<data.data.length;i++){
					console.log("pushing records");
					$scope.DriverList.push(data.data[i]);
				}
				$scope.loadMoreDriver= true;
				$scope.currentRowDriver = $scope.currentRowDriver+100;
				
			}
			else{
				console.log("Error in getting the Drivers");
			}
		}).error(function(error) {
			console.log("Error in getting the Drivers");
		});


};

$scope.clearAllDriver=function(){
	$scope.showTableDriver=false;
	$scope.driverFirstName = null;
	$scope.driverLastName = null;
	$scope.driverCity = null;
	$scope.driverEmailId = null;
	$scope.driverPhoneNo = null;
	$scope.driverSSNId = null;
    $scope.currentRowDriver=0;
    $scope.loadMoreDriver=false;
    $scope.showValidDriver = false ;
    $scope.DriverList=[];
};
});
	