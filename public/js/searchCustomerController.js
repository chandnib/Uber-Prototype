UberPrototypeAdmin.controller('searchCustomerController',function($scope,$http,$location,$window,$routeParams){
	$scope.CustomerList = [];
	$scope.searchInitCustomer =function(){
		$scope.currentRowCustomer=0;
		$scope.loadMoreCustomer = false;
	}
     $scope.searchCustomer =function(){
    	 console.log($scope);
    	 $http({
				method : "POST",
				url : '/searchCustomer',
				headers: {
					'Content-Type': 'application/json'
				},
				data : {
					customerFirstName : $scope.customerFirstName,
					customerLastName : $scope.customerLastName,
					customerCity : $scope.customerCity,
					customerEmailId : $scope.customerEmailId,
					customerPhoneNo : $scope.customerPhoneNo,
					customerSSNId : $scope.customerSSNId,
					currentRow : $scope.currentRowCustomer
				}
			}).success(function(data) {
				console.log("data"+JSON.stringify(data));
				//checking the response data for statusCode
				if (data.code == '200') {
					console.log("data"+data.data[0].ROW_ID);
					$scope.CustomerList = data.data;
					$scope.showTableCustomer=true;
					$scope.loadMoreCustomer = true;
					$scope.currentRowCustomer = $scope.currentRowCustomer + data.data.length;
				}
				else{
					console.log("Error in getting the Customers");
				}
			}).error(function(error) {
				$scope.showValidCustomer=true;
		        $scope.CustomerList = null;
			    $scope.showTableCustomer=false;
				console.log("Error in getting the Customers");
			});
     
     };
    

$scope.getMoreCustomer = function(){
		 $http({
				method : "POST",
				url : '/searchCustomer',
				headers: {
					'Content-Type': 'application/json'
				},
				data : {
					customerFirstName : $scope.customerFirstName,
					customerLastName : $scope.customerLastName,
					customerCity : $scope.customerCity,
					customerEmailId : $scope.customerEmailId,
					customerPhoneNo : $scope.customerPhoneNo,
					customerSSNId : $scope.customerSSNId,
					currentRow : $scope.currentRowCustomer
				}
			}).success(function(data) {
			console.log("data"+JSON.stringify(data));
			console.log("data.code"+data.code);
			//checking the response data for statusCode
			if (data.code == '200') {
				console.log("data"+data.data[0].ROW_ID);
				for(i=0;i<data.data.length;i++){
					console.log("pushing records");
					$scope.CustomerList.push(data.data[i]);
				}
				$scope.loadMoreCustomer = true;
				$scope.currentRowCustomer = $scope.currentRowCustomer+100;
				
			}
			else{
				console.log("Error in getting the Customers");
			}
		}).error(function(error) {
			console.log("Error in getting the Customers");
		});


};

$scope.clearAllCustomer=function(){
	$scope.showTableCustomer=false;
	$scope.customerFirstName = null;
	$scope.customerLastName = null;
	$scope.customerCity = null;
	$scope.customerEmailId = null;
	$scope.customerPhoneNo = null;
	$scope.customerSSNId = null;
    $scope.currentRowCustomer=0;
    $scope.loadMoreCustomer=false;
    $scope.showValidCustomer = false ;
    $scope.CustomerList=[];
};
});
	