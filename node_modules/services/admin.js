var mongo = require("../routes/mongo");
var mongoURL = "mongodb://localhost:27017/SocialMediaPrototypeDB";
var async = require('async');
var ObjectId = require('mongodb').ObjectID;

var self=this;

exports.signup = function(msg, callback){
	var EMAIL_ADDR = msg.EMAIL_ADDR;
	var PASSWORD = msg.PASSWORD;
	var FIRST_NAME = msg.FIRST_NAME;
	var LAST_NAME = msg.LAST_NAME;
	var DATE_OF_BIRTH = msg.DATE_OF_BIRTH;
	var GENDER = msg.GENDER;
	var IMAGE_URL = msg.IMAGE_URL;
	var res = {};
	try{
		mongo.connect(mongoURL, function(){ 
			console.log('Connected to mongo at: ' + mongoURL); 
			var coll = mongo.collection('USERS'); 
			coll.findOne({EMAIL_ADDR: EMAIL_ADDR},function(err,user){
				if(!err){
					if(!user){
						coll.insertOne({ROW_ID: "",EMAIL_ADDR: EMAIL_ADDR, PASSWORD : PASSWORD, FIRST_NAME:FIRST_NAME, LAST_NAME:LAST_NAME, DATE_OF_BIRTH:DATE_OF_BIRTH,GENDER:GENDER,IMAGE_URL:IMAGE_URL}, function(err,user){
							if(!err){
									console.log("User Sucessfully Inserted" + JSON.stringify(user));
									coll.findOne({EMAIL_ADDR: EMAIL_ADDR},function(err,user){    
									if (!err) {
										if(!user){
											//Unknown Error
											console.log("err" + err);
											res.code = "401";
											res.err  = "Failed to Insert User!!!";
											callback("Failed to Insert User!!!", res);	
										}		 
										else{
											res.code = 200;
											res.EMAIL_ADDR = user['EMAIL_ADDR'];
											res.FIRST_NAME = user['FIRST_NAME'];
											res.LAST_NAME = user['LAST_NAME'];
											res.DATE_OF_BIRTH = user['DATE_OF_BIRTH'];
											res.GENDER = user['GENDER'];
											res.IMAGE_URL = user['IMAGE_URL'];
											res.ROW_ID = user['_id'];
											coll.updateOne({EMAIL_ADDR: EMAIL_ADDR}, {$set: { "ROW_ID": res.ROW_ID }}, function(err,response){
												var userDetailcoll = mongo.collection('USER_DETAILS');
												var userDetails = {};
												userDetails.USER_ID = res.ROW_ID;
												userDetails.HOME_ADDR = "817 N 10th Street Apt 117";
												userDetails.WEB_URL = "https://www.linkedin.com/in/rakshithkhatwar";
												userDetails.PROFESSIONAL_SKILLS = "Android - Java - JavaScript - Objective-C/Temp - Siebel";
												userDetails.COMPANY = "Cognizant";
												userDetails.COLLEGE = "San Jose State University";
												userDetails.HIGH_SCHL = "Sri Cadambi Vidya Kendra";
												userDetails.ABOUT_ME = "two things in this world are infinite one is the universe and other is human stupidity and i am not sure about universe -Sir Albert Enstine";
												userDetails.CURR_CITY = "San Jose,California";
												userDetails.PHONE = "(669)-247-8890";
												userDetailcoll.insert(userDetails , function(err,response){
													var lifeEventColl = mongo.collection('LIFE_EVENTS');
													var lifeEventArray = [];
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"You are Born",DATE: "1988-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Moved to Bangalore, India",DATE: "1990-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Walked Your First Step",DATE: "1991-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"First Day of Pre Nursury",DATE: "1992-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Started Primary School",DATE: "1994-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Started High School at Sri Cadambi Vidya Kendra",DATE: "1998-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Graduated High School at Sri Cadambi Vidya Kendra",DATE: "2004-08-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Started College at San Jose State University",DATE: "2004-10-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Moved to San Jose, California",DATE: "2004-10-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Bought a New Car",DATE: "2006-10-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Started Work at Tech Mahindra",DATE: "2006-10-13"});
													lifeEventArray.push({USER_ID:res.ROW_ID,EVENT_NAME:"Quit Work at Tech Mahindra",DATE: "2011-10-13"});
													lifeEventColl.insertMany(lifeEventArray , function(err,response){
														callback(null, res);
													});
												});
											});
										} 
									}else{
										//Unknown Error
										console.log("err" + err);
										res.code = "401";
										res.err  = "Failed to Create User!!!please try again later...";
										callback(err, res);
									}
								});
							}
							else{
								//Unknown Error
								res.code = "401";
								res.err  = err;
								callback(err, res);
							}
						});	
					}else{
						//Username already Taken
						res.code = "401";
						res.err  = "This Email is already registered to another user!! Please try to register with another Email Address";
						callback(null, res);
					}
				}else{
					//Unknown Error
					res.code = "401";
					res.err  = err;
					callback(err, res);
				}
			});
		});
	}catch(e){
		console.log("signup : Error : " + e);
	}
};

exports.login = function(msg, callback){
	try{
		var res = {};
		mongo.connect(mongoURL, function(){ 
			console.log('Connected to mongo at: ' + mongoURL); 
			var coll = mongo.collection('USERS'); 
			console.log("Input from System -- msg : " + JSON.stringify(msg));
			coll.findOne({EMAIL_ADDR: msg.username},function(err,user){
				if(!err){
					if(user != null){
						console.log("User Found !! " + JSON.stringify(user));
						res = user;
						res.code = "200";
						callback(null, res);
					}else{
						//User Not Found
						res.code = "401";
						res.err  = "User not found in the system, Please register before trying to Login to the application..";
						callback(null, res);
					}
				}else{
					//Unknown Error
					res.code = "401";
					res.err  = err;
					callback(err, res);
				}
			});
		});
	}catch(e){
		console.log("login : Error : " + e);
	}
};

var friendidArray = [];
var friendsId = {};
var newsfeeds;

function getFriendsId(ROW_ID,callback){
	console.log("getFriendsId called !!");
	var coll = mongo.collection('FRIENDS_LIST');
	coll.find({USER1:ROW_ID,ACCEPTED:"Y"}).toArray(function(err,friends){
		self.friendsId = friends;
		for(var friend in self.friendsId){
			console.log("self.friendsId[friend] : " + JSON.stringify(self.friendsId[friend]));
			//self.friendidArray.push({USER_ID:self.friendsId[friend].USER2});
			self.friendidArray.push(self.friendsId[friend].USER2);
		}
		callback();
	});
}

function getNewsFeedfromDB(callback){
	console.log("getUserDetails : " + JSON.stringify(self.friendidArray));
	var coll = mongo.collection('NEWSFEEDS');
	coll.find( {USER_ID : {$in:self.friendidArray}}).toArray(function(err,newsfeed){
		console.log("newsfeed : " +JSON.stringify(newsfeed));
		self.newsfeeds = newsfeed;
		callback();
	});
	
}

exports.getNewsFeed = function(msg, callback){
	try{
		console.log("-----------------getNewsFeed-------------------------------------");
		var res = {};
		var ROW_ID = msg.ROW_ID;
		self.friendidArray = [];
		self.friendidArray.push(ROW_ID);
		
		mongo.connect(mongoURL, function(){ 
			console.log('Connected to mongo at: ' + mongoURL);
			
			async.series({
				friendId: async.apply(getFriendsId, ROW_ID),
				firendsdetails: getNewsFeedfromDB
			  }, function (error, results) {
			    if (error) {
			    	console.log("Error : " + error);
			    	//Unknown Error
					res.code = "401";
					
					callback(error, res);
			    }else{
				    console.log("results : " + JSON.stringify(results));
				    console.log("friendId : " + JSON.stringify(self.friendsId));
				    res.code = "200";
				    res.content  = self.newsfeeds;
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("getNewsFeed : Error : " + e);
	}
};

exports.postStatusUpdate = function(msg, callback){
	try{
		console.log("-----------------postStatusUpdate-------------------------------------");
		var res = {};
		console.log("postStatusUpdate Input : " + JSON.stringify(msg));
		var coll = mongo.collection('NEWSFEEDS'); 
		coll.insertOne(msg, function(err,newsfeed){
			console.log("newsfeed inserted : " + JSON.stringify(newsfeed));
			if(!err){
				//res = newsfeed;
				res.code = "200";
				callback(err, res);
			}else{
				//Unknown Error
				res.code = "401";
				res.err  = err;
				callback(err, res);
			}
		});
	}catch(e){
		console.log("postStatusUpdate : Error : " + e);
	}
};

var loadFriendLists;
var friendidArray1;
var friendsId1;

function queryAllFriendsOpenRequest(ROW_ID,callback){
	console.log("queryAllFriendsOpenRequest called !! " + ROW_ID);
	var coll = mongo.collection('FRIENDS_LIST');
	coll.find({USER2 : ROW_ID , ACCEPTED : "N"}).toArray(function(err,friends){
		self.friendsId1 = friends;
		for(var friend in self.friendsId1){
			console.log("queryAllFriendsOpenRequest -- self.friendsId1[friend] : " + JSON.stringify(self.friendsId1[friend]));
			self.friendidArray1.push(new ObjectId(self.friendsId1[friend].USER1));
		}
		callback();
	});
}

function queryAllFriends(ROW_ID,callback){
	console.log("queryAllFriends called !! " + ROW_ID);
	var coll = mongo.collection('FRIENDS_LIST');
	coll.find( { $or: [ { USER1 : ROW_ID } , {USER2 : ROW_ID , ACCEPTED : "N"} ] }).toArray(function(err,friends){
		self.friendsId1 = friends;
		for(var friend in self.friendsId1){
			console.log("queryAllFriends -- self.friendsId1[friend] : " + JSON.stringify(self.friendsId1[friend]));
			self.friendidArray1.push(new ObjectId(self.friendsId1[friend].USER2));
		}
		callback();
	});
}

function queryNonFriendsfromDB(callback){
	console.log("queryNonFriendsfromDB -- friendidArray1 : " + JSON.stringify(self.friendidArray1));
	var coll = mongo.collection('USERS');
	coll.find( {"_id" : { $nin : self.friendidArray1 } } ).toArray(function(err,friendslist){
		console.log("friendslist of non friends : " +JSON.stringify(friendslist));
		self.loadFriendLists = friendslist;
		callback();
	});
}

exports.loadFriendList = function(msg, callback){
	try{
		console.log("-----------------loadFriendList-------------------------------------");
		var res = {};
		var ROW_ID = msg.ROW_ID;
		self.loadFriendLists = [];
		self.friendidArray1 = [];
		self.friendidArray1.push(new ObjectId(ROW_ID));
		mongo.connect(mongoURL, function(){ 
			console.log('loadFriendLists -- Connected to mongo at: ' + mongoURL);
			
			async.series({
				friendId: async.apply(queryAllFriends, ROW_ID),
				friendId1: async.apply(queryAllFriendsOpenRequest, ROW_ID),
				firendsdetails: queryNonFriendsfromDB
			  }, function (error, results) {
			    if (error) {
			    	console.log("Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("loadFriendLists  : " + JSON.stringify(self.loadFriendLists));
				    res.code = "200";
				    res.content  = self.loadFriendLists;
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("loadFriendList : Error : " + e);
	}
};

var friendRequest;

exports.sendFiendRequest = function(msg, callback){
	try{
		console.log("--------------------------sendFiendRequest----------------------------");
		console.log("sendFiendRequest Request : " + JSON.stringify(msg));
		var res = {};
		var friendReqArr = [];
		self.friendRequest = {};
		self.friendRequest.USER1 = msg.USER1;
		self.friendRequest.USER2 = msg.friend.ROW_ID;
		self.friendRequest.EMAIL_ADDR = msg.friend.EMAIL_ADDR;
		self.friendRequest.FIRST_NAME = msg.friend.FIRST_NAME;
		self.friendRequest.LAST_NAME = msg.friend.LAST_NAME;
		self.friendRequest.DATE_OF_BIRTH = msg.friend.DATE_OF_BIRTH;
		self.friendRequest.GENDER = msg.friend.GENDER;
		self.friendRequest.IMAGE_URL = msg.friend.IMAGE_URL;
		self.friendRequest.ACCEPTED = "N";
		
		friendReqArr.push(self.friendRequest);
		//friendReqArr.push(self.friendRequest2);
		
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('FRIENDS_LIST');
			coll.insertMany(friendReqArr, function(err,user){
				console.log("sendFiendRequest inserted : " + JSON.stringify(user));
				if(!err){
					//res = newsfeed;
					res.code = "200";
					callback(err, res);
				}else{
					//Unknown Error
					res.code = "401";
					res.err  = err;
					callback(err, res);
				}
				
			});
		});
	}catch(e){
		console.log("sendFiendRequest : Error : " + e);
	}
};

exports.renderFriendListPage = function(msg, callback){
	try{
		console.log("--------------------------renderFriendListPage----------------------------");
		console.log("renderFriendListPage Request : " + JSON.stringify(msg));
		var res = {};
		mongo.connect(mongoURL, function(){ 
			console.log('renderFriendListPage - Connected to mongo at: ' + mongoURL); 
			var coll = mongo.collection('USERS'); 
			coll.findOne({EMAIL_ADDR: msg.username},function(err,user){
				if(!err){
					if(user != null){
						console.log("User Found !! " + JSON.stringify(user));
						res = user;
						res.code = "200";
						callback(null, res);
					}else{
						//User Not Found
						res.code = "401";
						res.err  = "User not found in the system, Please register before trying to Login to the application..";
						callback(null, res);
					}
				}else{
					//Unknown Error
					res.code = "401";
					res.err  = err;
					callback(err, res);
				}
			});
		});
	}catch(e){
		console.log("renderFriendListPage : Error : " + e);
	}
};

var loadFriendLists2;
var friendidArray2;
var friendsId2;

function queryMyFriends(ROW_ID,callback){
	console.log("queryMyFriends called !! " + ROW_ID);
	var coll = mongo.collection('FRIENDS_LIST');
	coll.find({USER1:ROW_ID,ACCEPTED:"Y"}).toArray(function(err,friends){
		self.friendsId2 = friends;
		for(var friend in self.friendsId2){
			console.log("queryMyFriends -- self.friendsId2[friend] : " + JSON.stringify(self.friendsId2[friend]));
			self.friendidArray2.push(new ObjectId(self.friendsId2[friend].USER2));
		}
		callback();
	});
}

function queryMyFriendsfromDB(callback){
	console.log("queryMyFriendsfromDB -- friendidArray2 : " + JSON.stringify(self.friendidArray2));
	var coll = mongo.collection('USERS');
	coll.find( {"_id" : { $in : self.friendidArray2 } } ).toArray(function(err,friendslist){
		console.log("queryMyFriendsfromDB friendslist of non friends : " +JSON.stringify(friendslist));
		self.loadFriendLists2 = friendslist;
		callback();
	});
	
}

exports.loadMyFriendList = function(msg, callback){
	try{
		console.log("--------------------------loadMyFriendList----------------------------");
		console.log("loadMyFriendList Request : " + JSON.stringify(msg));
		var res = {};
		var ROW_ID = msg.ROW_ID;
		self.loadFriendLists2 = [];
		self.friendidArray2 = [];
		mongo.connect(mongoURL, function(){ 
			console.log('loadMyFriendList -- Connected to mongo at: ' + mongoURL);
			
			async.series({
				friendId: async.apply(queryMyFriends, ROW_ID),
				firendsdetails: queryMyFriendsfromDB
			  }, function (error, results) {
			    if (error) {
			    	console.log("loadMyFriendList - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("loadMyFriendList  : " + JSON.stringify(self.loadFriendLists2));
				    res.code = "200";
				    res.content  = self.loadFriendLists2;
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("loadMyFriendList : Error : " + e);
	}
};

var loadFriendLists3;
var friendidArray3;
var friendsId3;

function queryMyPendingFriends(ROW_ID,callback){
	console.log("queryMyPendingFriends called !! " + ROW_ID);
	var coll = mongo.collection('FRIENDS_LIST');
	coll.find({USER2:ROW_ID,ACCEPTED:"N"}).toArray(function(err,friends){
		self.friendsId3 = friends;
		for(var friend in self.friendsId3){
			console.log("queryMyPendingFriends -- self.friendsId3[friend] : " + JSON.stringify(self.friendsId3[friend]));
			self.friendidArray3.push(new ObjectId(self.friendsId3[friend].USER1));
		}
		callback();
	});
}

function queryMyPendingFriendsfromDB(callback){
	console.log("queryNonFriendsfromDB -- friendidArray3 : " + JSON.stringify(self.friendidArray3));
	var coll = mongo.collection('USERS');
	coll.find( {"_id" : { $in : self.friendidArray3 } } ).toArray(function(err,friendslist){
		console.log("friendslist of non friends : " +JSON.stringify(friendslist));
		self.loadFriendLists3 = friendslist;
		callback();
	});
}

exports.loadPendingFriendList = function(msg, callback){
	try{
		console.log("--------------------------loadPendingFriendList----------------------------");
		console.log("loadPendingFriendList Request : " + JSON.stringify(msg));
		var res = {};
		var ROW_ID = msg.ROW_ID;
		self.loadFriendLists3 = [];
		self.friendidArray3 = [];
		mongo.connect(mongoURL, function(){ 
			console.log('loadPendingFriendList -- Connected to mongo at: ' + mongoURL);
			
			async.series({
				friendId: async.apply(queryMyPendingFriends, ROW_ID),
				firendsdetails: queryMyPendingFriendsfromDB
			  }, function (error, results) {
			    if (error) {
			    	console.log("loadPendingFriendList - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("loadPendingFriendList  : " + JSON.stringify(self.loadFriendLists3));
				    res.code = "200";
				    res.content  = self.loadFriendLists3;
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("loadPendingFriendList : Error : " + e);
	}
};

exports.rejectFriendRequest = function(msg, callback){
	try{
		console.log("--------------------------rejectFriendRequest----------------------------");
		console.log("rejectFriendRequest Request : " + JSON.stringify(msg));
		var res = {};
		var user2 = msg.ROW_ID;
		var user1 = msg.friend.ROW_ID;
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('FRIENDS_LIST');
			coll.deleteOne({USER1:user1,USER2:user2}, function(err,user){
				console.log("rejectFriendRequest deleted : " + JSON.stringify(user));
				if(!err){
					res.code = "200";
					callback(err, res);
				}else{
					//Unknown Error
					res.code = "401";
					res.err  = err;
					callback(err, res);
				}
				
			});
		});
	}catch(e){
		console.log("rejectFriendRequest : Error : " + e);
	}
};

var friendRequest2;

function updateCurrentFriendRecord(user1,user2,callback){
	var coll = mongo.collection('FRIENDS_LIST');
	coll.updateOne({USER1: user1.ROW_ID,USER2:user2}, {$set: { "ACCEPTED": "Y" }}, function(err,response){
		console.log("updateCurrentFriendRecord : " + JSON.stringify(response));
		callback();
	});
}

function insertFriendRecord(user1,user2,callback){
	self.friendRequest2 = {};
	self.friendRequest2.USER1 = user2;
	self.friendRequest2.USER2 = user1.ROW_ID;
	self.friendRequest2.EMAIL_ADDR = user1.EMAIL_ADDR;
	self.friendRequest2.FIRST_NAME = user1.FIRST_NAME;
	self.friendRequest2.LAST_NAME = user1.LAST_NAME;
	self.friendRequest2.DATE_OF_BIRTH = user1.DATE_OF_BIRTH;
	self.friendRequest2.GENDER = user1.GENDER;
	self.friendRequest2.IMAGE_URL = user1.IMAGE_URL;
	self.friendRequest2.ACCEPTED = "Y";
	
	var coll = mongo.collection('FRIENDS_LIST');
	coll.insertOne(self.friendRequest2,function(err,friends){
		callback();
	});
}

exports.acceptFriendRequest = function(msg, callback){
	try{
		console.log("--------------------------acceptFriendRequest----------------------------");
		console.log("acceptFriendRequest Request : " + JSON.stringify(msg));
		var res = {};
		var user2 = msg.ROW_ID;
		var user1 = msg.friend;
		mongo.connect(mongoURL, function(){
			async.series({
				friendId: async.apply(updateCurrentFriendRecord, user1,user2),
				firendsdetails: async.apply(insertFriendRecord,user1,user2)
			  }, function (error, results) {
			    if (error) {
			    	console.log("acceptFriendRequest - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("acceptFriendRequest  : " + JSON.stringify(self.friendRequest2));
				    res.code = "200";
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("acceptFriendRequest : Error : " + e);
	}
};

var UserInfo;

function queryUserInfo(row_id,callback){
	var coll = mongo.collection('USERS');
	coll.findOne( {"_id" : new ObjectId(row_id) },function(err,userinfo){
		console.log("queryUserInfo -- userinfo : " + JSON.stringify(userinfo));
		self.UserInfo = userinfo;
		callback();
	});
}

function queryUserDetails(row_id,callback){
	var coll = mongo.collection('USER_DETAILS');
	coll.findOne( {"USER_ID" : new ObjectId(row_id) },function(err,userdetails){
		console.log("queryUserDetails -- userdetails : " +JSON.stringify(userdetails));
		self.UserInfo.HOME_ADDR = userdetails.HOME_ADDR;
		self.UserInfo.WEB_URL = userdetails.WEB_URL;
		self.UserInfo.PROFESSIONAL_SKILLS = userdetails.PROFESSIONAL_SKILLS;
		self.UserInfo.COMPANY = userdetails.COMPANY;
		self.UserInfo.COLLEGE = userdetails.COLLEGE;
		self.UserInfo.HIGH_SCHL = userdetails.HIGH_SCHL;
		self.UserInfo.ABOUT_ME = userdetails.ABOUT_ME;
		self.UserInfo.CURR_CITY = userdetails.CURR_CITY;
		self.UserInfo.PHONE = userdetails.PHONE;
		callback();
	});
}

exports.renderUserDetailsPage = function(msg, callback){
	try{
		console.log("--------------------------renderUserDetailsPage----------------------------");
		console.log("renderUserDetailsPage Request : " + JSON.stringify(msg));
		var res = {};
		var row_id = msg.ROW_ID;
		self.UserInfo = {};
		mongo.connect(mongoURL, function(){
			async.series({
				friendId: async.apply(queryUserInfo,row_id),
				firendsdetails: async.apply(queryUserDetails,row_id)
			  }, function (error, results) {
			    if (error) {
			    	console.log("renderUserDetailsPage - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("renderUserDetailsPage  UserInfo -- : " + JSON.stringify(self.UserInfo));
				    res.code = "200";
				    res.content = self.UserInfo;
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("renderUserDetailsPage : Error : " + e);
	}
};

exports.getLifeEvents = function(msg, callback){
	try{
		console.log("--------------------------getLifeEvents----------------------------");
		console.log("getLifeEvents Request : " + JSON.stringify(msg));
		var res = {};
		var row_id = msg.ROW_ID;
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('LIFE_EVENTS');
			coll.find({USER_ID:new ObjectId(row_id)}).toArray(function(error,lifeevents){
				
				if (error) {
			    	console.log("getLifeEvents - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("getLifeEvents  lifeevents -- : " + JSON.stringify(lifeevents));
				    res.code = "200";
				    res.content = lifeevents;
				    callback(null, res);
			    }
			});
		});
	}catch(e){
		console.log("getLifeEvents : Error : " + e);
	}
};

function updateUSERS(row_id,path,callback){
	var coll = mongo.collection('USERS');
	coll.updateOne({_id: new ObjectId(row_id)}, {$set: { "IMAGE_URL": path }}, function(err,response){
		console.log("updateUSERS Updated : " + JSON.stringify(response));
		callback();
	});
}
function updateNEWSFEEDS(row_id,path,callback){
	var coll = mongo.collection('NEWSFEEDS');
	coll.updateMany({USER_ID:row_id}, {$set: { "IMAGE_URL": path }}, function(err,response){
		console.log("updateNEWSFEEDS Updated : " + JSON.stringify(response));
		callback();
	});
}

function updateFRIENDSLIST(row_id,path,callback){
	var coll = mongo.collection('FRIENDS_LIST');
	coll.updateMany({USER2:row_id}, {$set: { "IMAGE_URL": path }}, function(err,response){
		console.log("updateFRIENDSLIST Updated : " + JSON.stringify(response));
		callback();
	});
}

exports.updateProfilePicture = function(msg, callback){
	try{
		console.log("--------------------------updateProfilePicture----------------------------");
		console.log("updateProfilePicture Request : " + JSON.stringify(msg));
		var res = {};
		var row_id = msg.ROW_ID;
		var path = msg.newPath;
		mongo.connect(mongoURL, function(){
			async.series({
				friendId: async.apply(updateUSERS,row_id,path),
				firendsdetails: async.apply(updateNEWSFEEDS,row_id,path),
				firendsdetails1: async.apply(updateFRIENDSLIST,row_id,path)
			  }, function (error, results) {
			    if (error) {
			    	console.log("unFriendUserRequest - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("unFriendUserRequest -- : Response Sent : " + JSON.stringify(res));
				    res.code = "200";
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("updateProfilePicture : Error : " + e);
	}
};

function deleteFriendRequest(user1,user2,callback){
	var coll = mongo.collection('FRIENDS_LIST');
	coll.deleteOne({USER1:user1,USER2:user2}, function(err,result){
		console.log("deleteFriendRequest : Deleted : " + JSON.stringify(result));
		callback();
	});
}

function deleteOtherFriendRequest(user1,user2,callback){
	var coll = mongo.collection('FRIENDS_LIST');
	coll.deleteOne({USER1:user2,USER2:user1}, function(err,result){
		console.log("deleteOtherFriendRequest : Deleted : " + JSON.stringify(result));
		callback();
	});
}

exports.unFriendUserRequest = function(msg, callback){
	try{
		console.log("--------------------------unFriendUserRequest----------------------------");
		console.log("unFriendUserRequest Request : " + JSON.stringify(msg));
		var res = {};
		var user1 = msg.ROW_ID;
		var user2 = msg.friendid;
		mongo.connect(mongoURL, function(){
			async.series({
				friendId: async.apply(deleteFriendRequest,user1,user2),
				firendsdetails: async.apply(deleteOtherFriendRequest,user1,user2)
			  }, function (error, results) {
			    if (error) {
			    	console.log("unFriendUserRequest - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("unFriendUserRequest -- : Response Sent : " + JSON.stringify(res));
				    res.code = "200";
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("unFriendUserRequest : Error : " + e);
	}
};

exports.navToFriendDetailPage = function(msg, callback){
	try{
		console.log("--------------------------navToFriendDetailPage----------------------------");
		console.log("navToFriendDetailPage Request : " + JSON.stringify(msg));
		var res = {};
		var row_id = msg.ROW_ID;
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('USERS');
			coll.findOne({"_id":new ObjectId(row_id)}, function(error,user){
				if (error) {
			    	console.log("navToFriendDetailPage - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("navToFriendDetailPage  user -- : " + JSON.stringify(user));
				    res.code = "200";
				    res.content = user;
				    callback(null, res);
			    }
			});
		});
	}catch(e){
		console.log("navToFriendDetailPage : Error : " + e);
	}
};

var friendInfo;

function queryfriendInfo(row_id,callback){
	var coll = mongo.collection('USERS');
	coll.findOne( {"_id" : new ObjectId(row_id) },function(err,friend){
		console.log("queryfriendInfo -- friendInfo : " + JSON.stringify(friend));
		self.friendInfo = friend;
		callback();
	});
}

function queryFriendDetails(row_id,callback){
	var coll = mongo.collection('USER_DETAILS');
	coll.findOne( {"USER_ID" : new ObjectId(row_id) },function(err,userdetails){
		console.log("queryUserDetails -- userdetails : " +JSON.stringify(userdetails));
		self.friendInfo.HOME_ADDR = userdetails.HOME_ADDR;
		self.friendInfo.WEB_URL = userdetails.WEB_URL;
		self.friendInfo.PROFESSIONAL_SKILLS = userdetails.PROFESSIONAL_SKILLS;
		self.friendInfo.COMPANY = userdetails.COMPANY;
		self.friendInfo.COLLEGE = userdetails.COLLEGE;
		self.friendInfo.HIGH_SCHL = userdetails.HIGH_SCHL;
		self.friendInfo.ABOUT_ME = userdetails.ABOUT_ME;
		self.friendInfo.CURR_CITY = userdetails.CURR_CITY;
		self.friendInfo.PHONE = userdetails.PHONE;
		callback();
	});
}

exports.getFriendDetails = function(msg, callback){
	try{
		console.log("--------------------------getFriendDetails----------------------------");
		console.log("getFriendDetails Request : " + JSON.stringify(msg));
		var res = {};
		var row_id = msg.friendid;
		var friendArray = [];
		self.friendInfo = {};
		mongo.connect(mongoURL, function(){
			async.series({
				friendId: async.apply(queryfriendInfo,row_id),
				firendsdetails: async.apply(queryFriendDetails,row_id)
			  }, function (error, results) {
			    if (error) {
			    	console.log("getFriendDetails - Error : " + error);
			    	//Unknown Error
					res.code = "401";
					callback(error, res);
			    }else{
				    console.log("getFriendDetails  friendInfo -- : " + JSON.stringify(self.friendInfo));
				    res.code = "200";
				    friendArray.push(self.friendInfo)
				    res.content = friendArray;
				    callback(error, res);
			    }
			});
		});
	}catch(e){
		console.log("getFriendDetails : Error : " + e);
	}
};
