var ejs = require("ejs");
// var mysql = require('./mysql');
var mq_client = require('../rpc/client');


exports.generateBill = function(req, res) {
	var rideId = req.param("rideId");
	var distance = req.param("distance");
	var time = req.param("time");
	console.log("rideId :  "+ rideId);
	console.log("distance :  "+ distance);
	console.log("time :  "+ time);

	var msg_payload = {"rideId" : rideId,"distance" : distance,"time" : time};

	mq_client.make_request('uber_generateBill_queue',msg_payload,function(err, results) 
			{
						console.log(results);
						if (err) 
						{
							return results;
						} 
						else 
						{
							if (results.code == 200) 
							{
								console.log("back to node: Bill Generated successful");
								res.send(results);
							}
						}
					});
};

exports.getFareEstimate = function(req, res) {
	var distance = req.param("distance");
	var time = req.param("time");
	var longitude = req.param("longitude");
	var latitude = req.param("latitude");
	console.log("distance :  "+ distance);
	console.log("longitude :  "+ longitude);
	console.log("latitude :  "+ latitude);
	
	console.log("time :  "+ time);

	var msg_payload = {"distance" : distance,"time" : time,"latitude":latitude,"longitude":longitude};

	mq_client.make_request('uber_getFareEstimate_queue',msg_payload,function(err, results) 
			{
						//console.log(results);
						if (err) 
						{
							res.send(results);
						} 
						else 
						{
							if (results.code == 200) 
							{
								console.log("back to node: getFareEstimate executed succesfully");
								res.send(results);
							}
						}
					});
};

