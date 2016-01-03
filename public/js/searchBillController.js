UberPrototypeAdmin.controller('searchBillController',function($scope,$http,$location,$window,$routeParams){
	$scope.BillList = [];
	$scope.searchInit =function(){
     	$scope.fromdate="";
		$scope.toDate="";
		$scope.currentRow=0;
		$scope.loadMore = false;
	}
     $scope.searchBill =function(){
    	 console.log("yes i am working");
    	 console.log("toDate"+$scope.toDate);
    	 console.log("fromdate"+$scope.fromdate);
    	 console.log("custEmailId"+$scope.custEmailId);
    	 console.log("driverEmailId"+$scope.driverEmailId);
    	 var fromDate1 = new Date($scope.fromdate);
    	 var toDate1 = new Date($scope.toDate);
    	 console.log(fromDate1.getTime());
    	 console.log(toDate1.getTime());
    	 if(fromDate1.getTime()-toDate1.getTime()<0){
    	 /*if(fromDate1.getTime()-toDate1.getTime()<0)
    		 {
    		 $scope.showValid=true;
    		 console.log("fromDate1.getTime()-toDate1.getTime()"+fromDate1.getTime()-toDate1.getTime());
    		 }*/
    	 $http({
				method : "POST",
				url : '/searchBill',
				headers: {
					'Content-Type': 'application/json'
				},
				data : {
					toDate : $scope.toDate,
					fromdate : $scope.fromdate,
					custEmailId : $scope.custEmailId,
					driverEmailId : $scope.driverEmailId,
					currentRow : $scope.currentRow
				}
			}).success(function(data) {
				console.log("data"+JSON.stringify(data));
				//checking the response data for statusCode
				if (data.code == '200') {
					console.log("data"+data.data[0].ROW_ID);
					$scope.BillList = data.data;
					$scope.showTable=true;
					$scope.loadMore = true;
					$scope.currentRow = $scope.currentRow + data.data.length;
				}
				else{
					console.log("Error in getting the bills");
				}
			}).error(function(error) {
				console.log("Error in getting the bills");
			});
     }
     else{
    	 $scope.showValid=true;
    	 $scope.BillList = null;
			$scope.showTable=false;
     }
     };
    

$scope.loadMore1 = function(){
	 console.log("toDate"+$scope.toDate);
	 console.log("fromdate"+$scope.fromdate);
	 console.log("custEmailId"+$scope.custEmailId);
	 console.log("driverEmailId"+$scope.driverEmailId);
	 var fromDate1 = new Date($scope.fromdate);
	 var toDate1 = new Date($scope.toDate);
	 console.log(fromDate1.getTime());
	 console.log(toDate1.getTime());
	 if(fromDate1.getTime()-toDate1.getTime()<0){
	 /*if(fromDate1.getTime()-toDate1.getTime()<0)
		 {
		 $scope.showValid=true;
		 console.log("fromDate1.getTime()-toDate1.getTime()"+fromDate1.getTime()-toDate1.getTime());
		 }*/
	 $http({
			method : "POST",
			url : '/searchBill',
			headers: {
				'Content-Type': 'application/json'
			},
			data : {
				toDate : $scope.toDate,
				fromdate : $scope.fromdate,
				custEmailId : $scope.custEmailId,
				driverEmailId : $scope.driverEmailId,
				currentRow : $scope.currentRow
			}
		}).success(function(data) {
			console.log("data"+JSON.stringify(data));
			console.log("data.code"+data.code);
			//checking the response data for statusCode
			if (data.code == '200') {
				console.log("data"+data.data[0].ROW_ID);
				for(i=0;i<data.data.length;i++){
					console.log("pushing records");
					$scope.BillList.push(data.data[i]);
				}
				$scope.loadMore = true;
				$scope.currentRow = $scope.currentRow+100;
				
			}
			else{
				console.log("Error in getting the bills");
			}
		}).error(function(error) {
			console.log("Error in getting the bills");
		});
}
else{
	 $scope.showValid=true;
	 $scope.BillList = null;
		$scope.showTable=false;
}
};

$scope.clearAll=function(){
	$scope.showTable=false;
	$scope.fromdate="";
	$scope.toDate="";
	$scope.custEmailId=null;
	$scope.driverEmailId=null;
    $scope.currentRow=0;
    $scope.loadMore=false;
};
});
	