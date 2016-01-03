//CHANDNI

var ejs = require("ejs");
var mq_client = require('../rpc/client');


exports.createRide = function(req, res) {
	var pickup_address = req.param("pickup_address");
	var dropoff_address = req.param("dropoff_address");
	var pickup_latitude = req.param("pickupLat");
	var pickup_longitude = req.param("pickupLng");
	var dropoff_latitude = req.param("dropoffLat");
	var dropoff_longitude = req.param("dropoffLng");
	var customer_id = req.param("customer_id");
	var driver_id = req.param("driver_id");
	var distance_covered = req.param("distance_covered");
	var total_time = req.param("total_time");
	var pickup_location, dropoff_location;
	var driver_status = 'U';
	
//	var pickup_address = "190 Street, San Jose, CA, 95110";
//	var dropoff_address = "San Jose Stae University, San Jose , CA 95110";
//	var pickup_latitude = "37.340848";
//	var pickup_longitude = "-121.898409";
//	var dropoff_latitude = "37.309767";
//	var dropoff_longitude = "-121.874345";
	
	console.log("Customer Id in Rides.js" + customer_id);
	console.log(JSON.stringify(pickup_address));
	console.log(JSON.stringify(dropoff_address));
	console.log(pickup_latitude + pickup_longitude +dropoff_latitude + dropoff_longitude );
	console.log(distance_covered + " ," + total_time);
	

		var msg_payload = {
		"pickup_location" : pickup_address,
		"dropoff_location" : dropoff_address,
		"customer_id" : customer_id,
		"driver_id" : driver_id,
		"pickup_latitude" : pickup_latitude,
		"pickup_longitude" : pickup_longitude,
		"dropoff_latitude" : dropoff_latitude,
		"dropoff_longitude" : dropoff_longitude,
		"distance_covered" : distance_covered,
		"total_time" : total_time,
		"driver_status" : driver_status
	}; 

	mq_client.make_request('uber_createRide_queue', msg_payload, function(err,
			results) {
		console.log(results);
		if (results.code == 401) {
			console.log(results.err);
		} else {
			console.log("i'm in createRide");
			if (results.code == 200) {
				console.log("back to node: ride inserted successful");
				res.send(results);
			} else {
				console.log("back to node: insert failed");
				res.send("failed");
			}
		}
	});
};

exports.editRide = function(req, res) {
	console.log("inside edit ride");
	var newdropoff_address = req.param("newdropoff_location");
	var newdropoff_latitude = req.param("newdropoffLat");
	var newdropoff_longitude = req.param("newdropoffLng");
	var ride_id = req.param("ride_id");
	var distance_covered = req.param("distance_covered");
	var total_time = req.param("total_time");

	
//	var ride_id = 10;
//	var newdropoff_address = "St James Station, San Jose, CA, United States";
//	var newdropoff_latitude = "37.340848";
//	var newdropoff_longitude = "-121.898409";
	
	var customer_id = req.session.passport.user.ROW_ID;
	var msg_payload, newdropoff_location;

	console.log(newdropoff_address + "," + newdropoff_latitude + "," + newdropoff_longitude + "," + distance_covered + "," + total_time);

	console.log(JSON.stringify(newdropoff_address));

	msg_payload = {
		"newdropoff_address" : newdropoff_address,
		"newdropoff_latitude" : newdropoff_latitude,
		"newdropoff_longitude" : newdropoff_longitude,
		"customer_id" : customer_id,
		"ride_id" : ride_id,
		"distance_covered" : distance_covered,
		"total_time" : total_time
	};
	


			mq_client.make_request('uber_editRide_queue', msg_payload, function(err,results) {
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				} else {
					console.log("i'm in editRide");
					if (results.code == 200) {
						console.log("back to node: ride updated successful");
						res.send(results);
					} else {
						console.log("back to node: update failed");
						res.send("failed");
					}
				}
	});
							
};

//----------------------not being used-------------------------------------
exports.deleteRide = function(req,res)
{
	console.log("inside delete ride");
	var customer_id = 12345;
	
	var msg_payload =  {
			"customer_id" : customer_id
		};
	mq_client.make_request('uber_deleteRide_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				}
				else 
				{
					console.log("i'm here");
					if (results.code == 200) {
						console.log("back to node: ride deleted successful");
						res.send(results);
					} else {
						console.log("back to node: delete failed");
						res.send("failed");
					}
				}
			});

	
};

//----------------------not being used-------------------------------------

exports.startRide = function(req,res)
{
	console.log("inside start ride");
	var ride_id = req.param("ride_id");
	console.log(ride_id);
	
	var msg_payload = {
			"ride_id" : ride_id
		};
	
	mq_client.make_request('uber_startRide_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				}
				else 
				{
					console.log("i'm in startRide");
					if (results.code == 200) {
						console.log("back to node: ride started successful");
						res.send(results);
					} else {
						console.log("back to node: start ride failed");
						res.send("failed");
					}
				}
			});
	
};

exports.cancelRide = function(req,res)
{
	console.log("inside cancel ride");
	var ride_id = req.param("ride_id");
	console.log(ride_id);
	var driver_status = 'A';
	var driver_id = req.param("driver_id");
	
	var msg_payload = {
			"ride_id" : ride_id,
			"driver_status":driver_status,
			"driver_id" : driver_id
		};
	
	mq_client.make_request('uber_cancelRide_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				}
				else 
				{
					console.log("i'm in cancel ride");
					if (results.code == 200) {
						console.log("back to node: ride cancel successful");
						res.send(results);
					} else {
						console.log("back to node: cancel ride failed");
						res.send("failed");
					}
				}
			});
	
};

exports.endRide = function(req,res)
{
	console.log("inside end ride");
	var ride_id = req.param("ride_id");
	console.log(ride_id);
	var driver_status = 'A';
	var driver_id = req.param("driver_id");
	
	var msg_payload = {
			"ride_id" : ride_id,
			"driver_status":driver_status,
			"driver_id" : driver_id
		};
	
	mq_client.make_request('uber_endRide_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				}
				else 
				{
					console.log("i'm in end ride");
					if (results.code == 200) {
						console.log("back to node: ride end successful");
						res.send(results);
					} else {
						console.log("back to node: end ride failed");
						res.send("failed");
					}
				}
			});
	
};

exports.fetchRideStatus = function(req,res)
{
	console.log("inside fetch status");
	var ride_id = req.param("ride_id");
	console.log(ride_id);
	
	var msg_payload = {
			"ride_id" : ride_id
		};
	
	mq_client.make_request('uber_fetchRideStatus_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				}
				else 
				{
					console.log("i'm in fetch ride status");
					if (results.code == 200) {
						console.log("back to node: ride fetch successful");
						res.send(results);
					} else {
						console.log("back to node: ride fetch failed");
						res.send("failed");
					}
				}
			});
	
};

exports.getRideCreated = function(req,res)
{
	console.log("inside getRideCreated");
	
	var driver_id = req.param("driver_id");
	console.log (driver_id);
	
	var msg_payload = {
			"driver_id" : driver_id
		};
	
	mq_client.make_request('uber_getRideCreated_queue',msg_payload,function(err, results) 
			{
		if (results.code == 401) {
			console.log(results.err);
		}
				else 
				{
					console.log("i'm in getRideCreated ");
					if (results.code == 200) {
						console.log("back to node: get Details successful");
						res.send(results);
					} else {
						console.log("back to node: get Details failed");
						res.send("failed");
					}
				}
			});
	
};

exports.getCustomerTripSummary = function(req,res)
{
	console.log("inside getCustomerTripSummary");
	
	var customer_id = req.param("customer_id");
	console.log (customer_id);
	
	var msg_payload = {
			"customer_id" : customer_id
		};
	
	mq_client.make_request('uber_getCustomerTripSummary_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				} 
				else 
				{
					console.log("i'm in getCustomerTripSummary");
					if (results.code == 200) {
						console.log("back to node: getCustomerTripSummary successful");
						res.send(results);
					} else {
						console.log("back to node: getCustomerTripSummary failed");
						res.send("failed");
					}
				}
			});
	
};


exports.getDriverTripSummary = function(req,res)
{
	console.log("inside getDriverTripSummary");
	
	var driver_id = req.param("driver_id");
	console.log (driver_id);
	
	var msg_payload = {
			"driver_id" : driver_id
		};
	
	mq_client.make_request('uber_getDriverTripSummary_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				}
				else 
				{
					console.log("i'm in getDriverTripSummary");
					if (results.code == 200) {
						console.log("back to node: getDriverTripSummary successful");
						res.send(results);
					} else {
						console.log("back to node: getDriverTripSummary failed");
						res.send("failed");
					}
				}
			});
	
};


exports.getCustomerOngoingRides = function(req,res)
{
	
	
	var customer_id = req.param("customer_id");
	console.log("inside getOngoingRides" +  customer_id );
	
	var msg_payload = {};
		msg_payload = {
			"customer_id" : customer_id
		};
	mq_client.make_request('uber_getCustomerOngoingRides_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				} 
				else 
				{
					console.log("i'm in getCustomerOngoingRides");
					if (results.code == 200) {
						console.log("back to node: getCustomerOngoingRides successful");
						res.send(results);
					} else {
						console.log("back to node: getCustomerOngoingRides failed");
						res.send("failed");
					}
				}
			});
	
};

exports.getDriverOngoingRides = function(req,res)
{
	
	
	var driver_id = req.param("driver_id");
	console.log("inside getDriverOngoingRides" +  driver_id );
	
	var msg_payload = {};
		msg_payload = {
			"driver_id" : driver_id
		};
	mq_client.make_request('uber_getDriverOngoingRides_queue',msg_payload,function(err, results) 
			{
				console.log(results);
				if (results.code == 401) {
					console.log(results.err);
				} 
				else 
				{
					console.log("i'm in getDriverOngoingRides");
					if (results.code == 200) {
						console.log("back to node: getDriverOngoingRides successful");
						res.send(results);
					} else {
						console.log("back to node: getDriverOngoingRides failed");
						res.send("failed");
					}
				}
			});
	
};
