var amqp = require('amqp');
var util = require('util');
var user = require('./services/user');
var groups = require('./services/groups');
var connection = amqp.createConnection({host:'localhost'});

connection.on('ready', function() {
	
	connection.queue('verifyUser', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.login(message, function(err,res){
				console.log("verifyUser Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("verifyUser Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('loginUser', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.login(message, function(err,res){
				console.log("loginUser Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("loginUser Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('createUser', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.signup(message, function(err,res){
				console.log("createUser Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("createUser Queue Created!!! and listening to the Queue!");
	});
	
	
	connection.queue('getNewsFeed', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.getNewsFeed(message, function(err,res){
				console.log("getNewsFeed Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("getNewsFeed Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('postStatusUpdate', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.postStatusUpdate(message, function(err,res){
				console.log("postStatusUpdate Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("postStatusUpdate Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('loadFriendList', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.loadFriendList(message, function(err,res){
				console.log("loadFriendList Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("loadFriendList Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('sendFiendRequest', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.sendFiendRequest(message, function(err,res){
				console.log("sendFiendRequest Response : " + JSON.stringify(res));
					connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("sendFiendRequest Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('renderFriendListPage', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.renderFriendListPage(message, function(err,res){
				console.log("renderFriendListPage Response : " + JSON.stringify(res));
					connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("renderFriendListPage Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('loadMyFriendList', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.loadMyFriendList(message, function(err,res){
				console.log("loadMyFriendList Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("loadMyFriendList Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('loadPendingFriendList', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.loadPendingFriendList(message, function(err,res){
				console.log("loadPendingFriendList Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("loadPendingFriendList Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('rejectFriendRequest', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.rejectFriendRequest(message, function(err,res){
				console.log("rejectFriendRequest Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("rejectFriendRequest Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('acceptFriendRequest', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.acceptFriendRequest(message, function(err,res){
				console.log("acceptFriendRequest Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("acceptFriendRequest Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('renderUserDetailsPage', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.renderUserDetailsPage(message, function(err,res){
				console.log("renderUserDetailsPage Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("renderUserDetailsPage Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('getLifeEvents', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.getLifeEvents(message, function(err,res){
				console.log("getLifeEvents Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("getLifeEvents Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('updateProfilePicture', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.updateProfilePicture(message, function(err,res){
				console.log("updateProfilePicture Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("updateProfilePicture Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('unFriendUserRequest', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.unFriendUserRequest(message, function(err,res){
				console.log("unFriendUserRequest Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("unFriendUserRequest Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('renderGroupsPage', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.renderGroupsPage(message, function(err,res){
				console.log("renderGroupsPage Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("renderGroupsPage Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('loadAllGroups', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.loadAllGroups(message, function(err,res){
				console.log("loadAllGroups Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("loadAllGroups Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('loadMyGroups', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.loadMyGroups(message, function(err,res){
				console.log("loadMyGroups Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("loadMyGroups Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('addUserToGroup', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.addUserToGroup(message, function(err,res){
				console.log("addUserToGroup Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("addUserToGroup Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('removeUserFromGroup', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.removeUserFromGroup(message, function(err,res){
				console.log("removeUserFromGroup Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("removeUserFromGroup Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('createGroup', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.createGroup(message, function(err,res){
				console.log("createGroup Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("createGroup Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('navToGroupDetailPage', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.navToGroupDetailPage(message, function(err,res){
				console.log("navToGroupDetailPage Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("navToGroupDetailPage Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('getGroupDetails', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.getGroupDetails(message, function(err,res){
				console.log("getGroupDetails Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("getGroupDetails Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('getGroupUserList', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.getGroupUserList(message, function(err,res){
				console.log("getGroupUserList Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("getGroupUserList Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('getGroupNonMembers', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.getGroupNonMembers(message, function(err,res){
				console.log("getGroupNonMembers Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("getGroupNonMembers Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('addUserToGroupAdmin', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.addUserToGroupAdmin(message, function(err,res){
				console.log("addUserToGroupAdmin Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("addUserToGroupAdmin Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('removeUserFromGroupAdmin', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.removeUserFromGroupAdmin(message, function(err,res){
				console.log("removeUserFromGroupAdmin Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("removeUserFromGroupAdmin Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('deleteGroup', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			groups.deleteGroup(message, function(err,res){
				console.log("deleteGroup Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("deleteGroup Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('navToFriendDetailPage', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.navToFriendDetailPage(message, function(err,res){
				console.log("navToFriendDetailPage Response : " + JSON.stringify(res));
				connection.publish(messageHeader.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:messageHeader.correlationId
				});
			});
		});
		console.log("navToFriendDetailPage Queue Created!!! and listening to the Queue!");
	});
	
	connection.queue('getFriendDetails', function(q){
		q.subscribe(function(message, header, deliveryInfo, messageHeader){
			try{
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				user.getFriendDetails(message, function(err,res){
					console.log("getFriendDetails Response : " + JSON.stringify(res));
					connection.publish(messageHeader.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:messageHeader.correlationId
					});
				});
			}
			catch(e){
				console.log(e);
			}
		});
		console.log("getFriendDetails Queue Created!!! and listening to the Queue!");
	});
	
});