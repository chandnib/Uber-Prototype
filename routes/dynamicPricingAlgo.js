var amqp = require('amqp');
var connection = amqp.createConnection({host:'127.0.0.1'});
var rpc = new (require('../rpc/amqprpc'))(connection);

var pricingConfig = {
		time_of_day : true,
		current_weather : true,
		number_of_request :true,
		number_of_drivers: true,
		day_of_the_week : true
}

function dateDiff(time1,time2) {
//	can also be done by converting the time to seconds    
	var t1 = new Date();
	var parts = time1.split(":");
	t1.setHours(parts[0],parts[1],parts[2],0);
	var t2 = new Date();
	parts = time2.split(":");
	t2.setHours(parts[0],parts[1],parts[2],0);

	return parseInt(Math.abs(t1.getTime()-t2.getTime())/1000);
}

function dateCompare(time1,time2) {
	var t1 = new Date();
	var parts = time1.split(":");
	t1.setHours(parts[0],parts[1],parts[2],0);
	var t2 = new Date();
	parts = time2.split(":");
	t2.setHours(parts[0],parts[1],parts[2],0);

	// returns 1 if greater, -1 if less and 0 if the same
	if (t1.getTime()>t2.getTime()) return 1;
	if (t1.getTime()<t2.getTime()) return -1;
	return 0;
}

exports.getPricingSurcharge = function(latitude,longitude){
	//var latitude  = 37.340634;
	//var longitude = -121.900036 ;
	var latlongArr = [];
	latlongArr.push(latitude);//(37.356281);
	latlongArr.push(longitude);//(-121.892623);
	
	try{
		var time_of_day_values =[
		                         {slot:'early_morning',start:'05:00:00',end:'07:00:00',surcharge : 3},
		                         {slot:'morning_peak', start:'07:01:00',end:'10:00:00',surcharge : 2},
		                         {slot:'normal', start:'10:01:00',end:'16:00:00',surcharge : 1},
		                         {slot:'evening_peak', start:'16:01:00',end:'21:00:00',surcharge : 2},
		                         {slot:'late_night', start:'21:01:00',end:'04:59:00',surcharge : 3}
		                         ];

		var surcharge = 0;
		
		//Surcharge based on the "time_of_day" in the region
		if(pricingConfig.time_of_day){

			var now = new Date();
			var HH = now.getHours();
			var MM = now.getMinutes();
			var SS = now.getSeconds();
			var currentTimeStr = HH + ":" + MM + ":" + SS; 

			console.log("currentTimeStr ==> " + currentTimeStr);

			for(var i in time_of_day_values){
				var isStartGreater = dateCompare(time_of_day_values[i].start,currentTimeStr);
				var isEndLesser = dateCompare(currentTimeStr,time_of_day_values[i].end);
				console.log("Current Slot!!");
				console.log(time_of_day_values[i].slot);
				console.log("isStartGreater = > " + isStartGreater);
				console.log("isEndLesser = > " + isEndLesser);
				if(isStartGreater == -1 && isEndLesser == -1){
					console.log("The Current Time slot is " + time_of_day_values[i].slot+ " and the surecharge of " + time_of_day_values[i].surcharge + " is applied!!!");
					surcharge += Number(time_of_day_values[i].surcharge);
					break;
				}
			}
			console.log("Current surcharge (After TIME SLOTS) ==> " + Number(surcharge)); 
		}
		//Surcharge for Weekend
		if(pricingConfig.day_of_the_week){
			var now = new Date();
			switch(now.getDay()){
			case 0 : //Sunday
				surcharge += 0.5;
				break;
				
			case 1 : //Monday
				surcharge += 0.2;
				break;
				
			case 2 : //Tuesday
				surcharge += 0.0;
				break;
				
			case 3 : //wednesday
				surcharge += 0.0;
				break;
				
			case 4 : //thursday
				surcharge += 0.0;
				break;
				
			case 5 : //Friday
				surcharge += 1.5;
				break;
				
			case 6 : //Saturday
				surcharge += 2.0;
				break;
			
			default :
				break;
				
			}
		}
		
		//Surcharge based on the weather in the region
		if(pricingConfig.current_weather){
			var weatherHazardMultiplier = 2;
			
			var Forecast = require('forecast');
			var forecast = new Forecast({
				service: 'forecast.io',
				key: '46157fe905d5339c2304be625e7ff04e',
				units: 'fahrenheit', // Only the first letter is parsed 
				cache: true,      // Cache API requests? 
				ttl: {            
					minutes: 27,
					seconds: 45
				}
			});

			forecast.get(latlongArr, function(err, weather) {
				if(err)
					console.dir(err);
				else{
					console.dir(weather); 
					var currentWeather = weather.currently.summary + " " + weather.currently.icon
					var temperature = weather.currently.temperature;
					currentWeather = currentWeather.toUpperCase();
					console.log("currentWeather ==> " + currentWeather);
					console.log("temperature ==> " + temperature);
					if(temperature < 30 || temperature > 80 || currentWeather.indexOf("RAIN") != -1 || currentWeather.indexOf("SNOW") != -1){
						surcharge += weatherHazardMultiplier;
						console.log("Inside Current surcharge (After current_weather) ==> " + Number(surcharge)); 
					}
				}
				
				//Surcharge based on the number of request in the application
				var timespan = 1;//Hours
				if(pricingConfig.number_of_request){
					var currDate = new Date();
					var currDateStr = currDate.getFullYear()+"-"+(currDate.getMonth()+1) + "-" + currDate.getDate();//"2015-10-01
					currDateStr += "T" + (currDate.getHours()-timespan) + ":" + currDate.getMinutes() + ":" + currDate.getSeconds() + "." + currDate.getMilliseconds() + "Z"//T08:00:00.000Z"
					var mongoRequests = "mongodb://localhost:27017/requests";
					var mongo = require("./mongo");
					console.log("Date Generated !! +> " + currDateStr)
					try{
						mongo.connect(mongoRequests, function() {
							var coll = mongo.collection('requests');
							var no_of_request = 0;
							coll.find({
								"requestTime" : {"$gte":  new Date(currDateStr)}
							}).toArray(function(err,users){
								console.log("number of Requests ==> " + users.length);
								no_of_request = users.length;
								surcharge += Number(no_of_request/1000);
								console.log("Current surcharge (After Number of Request !!) ==> " + Number(surcharge)); 
							
								if(pricingConfig.number_of_drivers){
									try{
										var DriverThresholdLimit = 5;
										var DriverSurcharge = 2;
										var data = {
												latitude: latitude,
												longitude: longitude
										};
										rpc.makeRequest("showDriverin10Mile_queue", data, function(err, user) {
											console.log("Driver in the Area : " + user.data.length);
											if (err) {
												console.log("There is an error: " + err);
											} else {
												if((user.length < DriverThresholdLimit)){
													surcharge += Number(DriverSurcharge);
												}
											}
											res.status(200).send(surcharge.toString());
										});
									}catch(e){
									 console.log(e);
									 res.status(404).send("Error");
									}
								}
								
							});
						});
					}catch(e){
						console.log(e);
					}
				}
				
			});
		}
		
		console.log("Current surcharge (After current_weather) ==> " + Number(surcharge)); 

	}catch(e){
		console.log(e);
	}
}

