var async = require('async');
var adminAccountOperations = require('./adminAccountOperations');
var requestId = 0;

function deligateMQAccessRequest(operation,data,req,res,requestId,rpc){

	console.log("handleDBRequest - " + operation +" with requestId : " + requestId);

	switch(operation){
	
		case "loadUnverifiedCustomers" :
			console.log("loadUnverifiedCustomers ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				rpc.makeRequest("loadUnverifiedCustomers", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
		break;
		
		case "approveCustomer" :
			console.log("approveCustomer ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Customer Info
				rpc.makeRequest("approveCustomer", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "rejectCustomer" :
			console.log("rejectCustomer ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Customer Info
				rpc.makeRequest("rejectCustomer", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "approveAllCustomer" :
			console.log("approveAllCustomer ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Customer Info
				rpc.makeRequest("approveAllCustomer", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "rejectAllCustomer" :
			console.log("rejectAllCustomer ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Customer Info
				rpc.makeRequest("rejectAllCustomer", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "loadUnverifiedDrivers" :
			console.log("loadUnverifiedDrivers ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				rpc.makeRequest("loadUnverifiedDrivers", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
		break;
		
		case "approveDriver" :
			console.log("approveDriver ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Driver Info
				rpc.makeRequest("approveDriver", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "rejectDriver" :
			console.log("rejectDriver ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Driver Info
				rpc.makeRequest("rejectDriver", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "approveAllDriver" :
			console.log("approveAllDriver ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
				//data ==> contains Driver Info
				rpc.makeRequest("approveAllDriver", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "rejectAllDriver" :
			console.log("rejectAllDriver ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("rejectAllDriver", data, function(err, response) {
					console.log("Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
						console.log(response);
						res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																																																																																
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "loadCustomerDetail" :
			console.log("loadCustomerDetail ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("loadCustomerDetail", data, function(err, response) {
					console.log("loadCustomerDetail Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
							console.log(response);
							res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;

		case "loadDriverDetail" :
			console.log("loadDriverDetail ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("loadDriverDetail", data, function(err, response) {
					console.log("loadDriverDetail Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
							console.log(response);
							res.status(200).send(response.data);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "revenueStats" :
			console.log("revenueStats ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("revenueStats", data, function(err, response) {
					console.log("revenueStats Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if (response.code == 200) {
							console.log("Everthing is fine!!!");
							res.send(response);
						} else {
							console.log("Did not delete. Try again");
							res.send("Error");
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;

		case "totalrideStats" :
			console.log("totalrideStats ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("totalrideStats", data, function(err, response) {
					console.log("totalrideStats Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if (response.code == 200) {
							console.log("Everthing is fine!!!");
							res.send(response);
						} else {
							console.log("Did not delete. Try again");
							res.send("Error");
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "cutomerrideStats" :
			console.log("cutomerrideStats ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("cutomerrideStats", data, function(err, response) {
					console.log("cutomerrideStats Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if (response.code == 200) {
							console.log("cutomerrideStats Everthing is fine!!!");
							res.send(response);
						} else {
							console.log(" cutomerrideStats Did not delete. Try again");
							res.send("Error");
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
		case "driverrideStats" :
			console.log("driverrideStats ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("driverrideStats", data, function(err, response) {
					console.log("driverrideStats Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if (response.code == 200) {
							console.log("Everthing is fine!!!");
							res.send(response);
						} else {
							console.log("Did not delete. Try again");
							res.send("Error");
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
				case "searchBill" :
			console.log("searchBill ==> " + operation);	
			if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
				//data ==> contains Driver Info
				rpc.makeRequest("searchBill", data, function(err, response) {
					console.log("searchBill Response from RabbitMQ Server ==> " + JSON.stringify(response));
					if (response){
						if(response.code == 200) {
							console.log(response);
							res.status(200).send(response);
						}else{
							res.status(404).send(response.err);
						}
					}else{
						res.status(404).send("error in Executing the operation!!");																																																																																																						
					}
				});
			}
			else{
				adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
			}
			break;
			
				case "searchCustomer" :
					console.log("searchCustomer ==> " + operation);	
					if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
						//data ==> contains Driver Info
						rpc.makeRequest("searchCustomer", data, function(err, response) {
							console.log("searchCustomer Response from RabbitMQ Server ==> " + JSON.stringify(response));
							if (response){
								if(response.code == 200) {
									console.log(response);
									res.status(200).send(response);
								}else{
									res.status(404).send(response.err);
								}
							}else{
								res.status(404).send("error in Executing the operation!!");																																																																																																						
							}
						});
					}
					else{
						adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
					}
					break;
					
				case "searchDriver" :
					console.log("searchDriver ==> " + operation);	
					if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){						
						//data ==> contains Driver Info
						rpc.makeRequest("searchDriver", data, function(err, response) {
							console.log("searchDriver Response from RabbitMQ Server ==> " + JSON.stringify(response));
							if (response){
								if(response.code == 200) {
									console.log(response);
									res.status(200).send(response);
								}else{
									res.status(404).send(response.err);
								}
							}else{
								res.status(404).send("error in Executing the operation!!");																																																																																																						
							}
						});
					}
					else{
						adminAccountOperations.userUnverified(res,"Your Session is no Longer Valid!! Please login again to Proceed.",{},req);
					}
					break;
							
		default:
			break;
	}
}

module.exports = {
	handleDBRequest : function(operation,data,req,res,rpc){
		console.log("handleDBRequest got the Request to '" + operation +"' and its handled with RequestId : " + requestId);
		deligateMQAccessRequest(operation,data,req,res,requestId,rpc);
		requestId++;
	}
};
