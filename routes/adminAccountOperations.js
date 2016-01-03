var amqp = require('amqp');
var connection = amqp.createConnection({host:'127.0.0.1'});
var rpc = new (require('../rpc/amqprpc'))(connection);

module.exports = {
		setup : function(){
			console.log("RabbitMQ Connection Setup!!");
		},
		loadUnverifiedCustomers : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("loadUnverifiedCustomers",user,req,res,rpc);
		},
		userUnverified : function(req,res){
			res.redirect("/invalidSessionAdminLogin");
		},
		approveCustomer : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("approveCustomer",user,req,res,rpc);
		},
		rejectCustomer : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("rejectCustomer",user,req,res,rpc);
		},
		approveAllCustomer: function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("approveAllCustomer",user,req,res,rpc);
		},
		rejectAllCustomer : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("rejectAllCustomer",user,req,res,rpc);
		},
		loadUnverifiedDrivers : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("loadUnverifiedDrivers",user,req,res,rpc);
		},
		approveDriver : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("approveDriver",user,req,res,rpc);
		},
		rejectDriver : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("rejectDriver",user,req,res,rpc);
		},
		approveAllDriver: function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("approveAllDriver",user,req,res,rpc);
		},
		rejectAllDriver : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("rejectAllDriver",user,req,res,rpc);
		},
		loadCustomerDetail : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("loadCustomerDetail",user,req,res,rpc);
		},
		searchBill : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("searchBill",user,req,res,rpc);
		},
		searchCustomer : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("searchCustomer",user,req,res,rpc);
		},
		searchDriver : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("searchDriver",user,req,res,rpc);
		},
		loadDriverDetail : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("loadDriverDetail",user,req,res,rpc);
		},
		revenueStats : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("revenueStats",user,req,res,rpc);
		},
		totalrideStats : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("totalrideStats",user,req,res,rpc);
		},
		cutomerrideStats : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("cutomerrideStats",user,req,res,rpc);
		},
		driverrideStats : function(user,req,res){
			var MQConnection = require('./mongoDBRequestBroker');
			MQConnection.handleDBRequest("driverrideStats",user,req,res,rpc);
		}
};

function userLogin(res,data,req){
	var userName = data.username;
	console.log("userName " + userName);
	if(req.session.username == "" || req.session.username == null){
		req.session.username = data.emailM;
		req.session.firstname = data.firstname;
		req.session.lastname = data.lastname;
		req.session.ROW_ID = data.ROW_ID;
		req.session.IMAGE_URL = data.IMAGE_URL;
		console.log("Session set" + req.session.username + "," + req.session.ROW_ID + "," + req.session.firstname + ", " + req.session.IMAGE_URL);
	}else
		console.log("Exisiting Session " + req.session.username + "," + req.session.ROW_ID + "," + req.session.firstname + ", " + req.session.IMAGE_URL);
	res.redirect("/home");//Default Action !!
	//res.status(200).send("Sucessful Login");
};