var adminAccountOperations = require('./adminAccountOperations');
var amqp = require('amqp');
var connection = amqp.createConnection({host:'127.0.0.1'});
var rpc = new (require('../rpc/amqprpc'))(connection);

exports.loginDrivers = function(req,res){
	var data = {};
	data.EMAIL = req.body.username;
	data.PASSWORD = req.body.password;
	rpc.makeRequest("verifyDriver", data,
			function(err, user) {
		console.log("verifyDriver : "+ JSON.stringify(user));
		if(err){
			res.status(404).send("Error");
		}
		else{
			if(user == null || user == "" || user == {}){
				res.status(404).send("Error");
			}
			else{
				if(user.code == "200"){
					res.status(200).send("Successfull");
				}else{
					res.status(404).send("Error");
				}

			}
		}
	});
};

exports.driverHome = function(req, res){
	console.log("Session Set by Passport !!! ==>  " + JSON.stringify(req.session));
	if(req.session.passport != null && req.session.passport != ""){
		if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
			res.render('driverHome', {user:JSON.stringify(req.session.passport.user)});
		}
		else
			res.redirect("/invalidSessionDriverLogin");
	}
	else
		res.redirect("/invalidSessionDriverLogin");
}

exports.signUpDriver = function(req, res){
	res.render('Sign_up_Driver', { title: 'HOME' });
}

exports.driverLoginPage = function(req, res){
	if(req.session.passport != null && req.session.passport != ""){
		console.log("Existing Session on Passport !!! ==>  " + JSON.stringify(req.session));
		if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
			res.render('driverHome', {user:JSON.stringify(req.session.passport.user)});
		}
		else
			res.render('loginDriver', {user:JSON.stringify({})});
	}
	else
		res.render('loginDriver', {user:JSON.stringify({})});
};

exports.adminHome = function(req, res){
	console.log("Session Set by Passport !!! ==>  " + JSON.stringify(req.session));
	if(req.session.passport != null && req.session.passport != ""){
		if(req.session.passport.user.EMAIL != "" && req.session.passport.user.EMAIL != null){
			res.render('driverHome', {user:JSON.stringify(req.session.passport.user)});
		}
		else
			res.redirect("/invalidDriverLogin");
	}
	else
		res.redirect("/invalidDriverLogin");
};

exports.driverSignUp = function(req, res){
	console.log("Request body for signup driver ==> " + JSON.stringify(req.body));
	var data = {};
	var zipCheck = false;
	var stateAbrevCheck = false;
	var stateCheck = false;
	var mobileCheck = false;
	var errorMessage = "";
	
	if(req.param("email") && req.param("password") && req.param("firstName") && req.param("lastName") && req.param("mobileNumber") && req.param("carModel") && req.param("carColor") && req.param("carYear") && req.param("address") && req.param("city") && req.param("state") && req.param("zipCode"))
	{
	var zipCodeCheck = /^\d{5}(?:[-]\d{4})?$/;	
	//Regular expression check for valid state abbreviations and full state names
	var stateAbbrevCheck = /^(AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NB|NC|ND|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)$/i;	
    var stateFullCheck = /^(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming)/;
	var mobileNumberCheck = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/;

	if(zipCodeCheck.test(req.param("zipCode")))
	{
	zipCheck = true
	}
	if(stateAbbrevCheck.test(req.param("state")))
	{
		stateAbrevCheck = true;
	}
	if(stateFullCheck.test(req.param("state")))
	{
		stateCheck = true;
	}
	if(mobileNumberCheck.test(req.param("mobileNumber")))
	{
		mobileCheck = true;
	}
	if(zipCheck && (stateAbrevCheck||stateCheck) && mobileCheck)
	{
	data.EMAIL = req.param("email");
	data.PASSWORD = req.param("password");
	data.FIRSTNAME = req.param("firstName");
	data.LASTNAME = req.param("lastName");
	data.MOBILENUMBER = req.param("mobileNumber");
	data.CARMODEL = req.param("carModel");
	data.CARCOLOR = req.param("carColor");
	data.CARYEAR = req.param("carYear");
	data.ADDRESS = req.param("address");
	data.CITY = req.param("city");
	data.STATE = req.param("state");
	data.ZIPCODE = req.param("zipCode");
		rpc.makeRequest("addDriver", data,
				function(err, user) {
			console.log("User : "+ JSON.stringify(user));
			if(err){
				res.redirect("/customerSignUp");
			}
			else{
					if(user.code == "200"){
						console.log("Everthing is fine!!!");
						res.redirect("/Log_In");					
						}
					else{
						if(user.err=="User already in system")
						{
						errorMessage = "Email already taken. Please use another one";
						}
					res.send({
						"statusCode" : 401,
						"errorMessage": errorMessage
					});
					}
			}
		});
		}
	else {
		if(!zipCheck)
		{
	    errorMessage+="Zip Code is incorrect format. Please try again\n";
		}

		if (!stateAbrevCheck)
		{
	    errorMessage+="Not a valid State Abbreviation\n";
		}
		if (!stateCheck)
		{
	    errorMessage+="Not a valid State\n";
		}
		if (!mobileCheck)
		{
	    errorMessage+="Not a valid US phone number\n";
		}
		res.send({
		"statusCode" : 401,
		"errorMessage": errorMessage
	});
	}
	}
	else
		{
		res.send({
			"statusCode" : 401,
			"errorMessage": "Not all Fields are filled"
		});
		}
};

exports.updateProfile = function(req, res) {
	var data = {};
		data.EMAIL = req.param("email");
		data.OLDEMAIL = req.session.passport.user.EMAIL;
		data.PASSWORD = req.param("password");
		data.FIRSTNAME = req.param("firstName");
		data.LASTNAME = req.param("lastName");
		data.ADDRESS = req.param("address");
		data.CITY = req.param("city");
		data.STATE = req.param("state");
		data.ZIPCODE = req.param("zip");
		data.CARMODEL = req.param("carModel");
		data.CARCOLOR = req.param("carColor");
		data.CARYEAR = req.param("carYear");
		data.PHONENUMBER = req.param("phoneNumber");

		var zipCheck = true;
		var stateAbrevCheck = true;
		var stateCheck = true;
		var phoneCheck = true;

		var errorMessage = "";
		var zipCodeCheck = /^\d{5}(?:[-]\d{4})?$/;	
		//Regular expression check for valid state abbreviations and full state names
		var stateAbbrevCheck = /^(AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NB|NC|ND|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)$/i;	
	    var stateFullCheck = /^(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming)/;
		var mobileNumberCheck = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/;

	    if(req.param("zip"))
		{
	    	console.log("Got in zip check");
		if(!zipCodeCheck.test(req.param("zip")))
			{
			zipCheck = false;
			}
			}
		if(req.param("state"))
		{
			console.log("Testing the state thing: "+req.param("state"));
		if(!stateAbbrevCheck.test(req.param("state")))
		{
			stateAbrevCheck = false;
		}
		}
		if(req.param("state"))
		{
		if(!stateFullCheck.test(req.param("state")))
		{
			stateCheck = false;
		}
		}
		if(req.param("phoneNumber"))
		{
		if(!mobileNumberCheck.test(req.param("phoneNumber")))
		{
			phoneCheck = false;
		}
		}
		if(zipCheck && (stateAbrevCheck || stateCheck) && phoneCheck)
		{
			console.log("In driver update about to send request");
		rpc.makeRequest("updateDriver", data, function(err, user) {
			console.log("User : " + JSON.stringify(user));
			if (err) {
				res.send({"statusCode" : 401});
			} else {
				if (user.code == "200") {
					console.log("Everthing is fine!!!");
					res.send({"statusCode" : 200});
				} else {
					res.send({"statusCode" : 401});
				}
			}
		});
			}
		else
			{
			if(!zipCheck)
			{
		    errorMessage+="Zip Code is incorrect format. Please try again\n";
			}
			if (!stateAbrevCheck)
			{
		    errorMessage+="Not a valid State Abbreviation\n";
			}
			if (!stateCheck)
			{
		    errorMessage+="Not a valid State\n";
			}
			if (!phoneCheck)
			{
		    errorMessage+="Not a valid US phone number\n";
			}
			res.send({"statusCode" : 402,
				"errorMessage": errorMessage});
			}

};

exports.deleteDriver = function(req, res) {
	var data = {};
	data.EMAIL = req.session.passport.user.EMAIL
	rpc.makeRequest("deleteDriver", data, function(err, user) {
		console.log("User : " + JSON.stringify(user));
		if (err) {
			alert("There is an error: " + err);
		} else {
			if (user.code == "200") {
				console.log("Everthing is fine!!!");
				req.logout();
				req.session.destroy();
				res.redirect("/");
			} else {
				alert("Did not delete. Try again");
			}
		}
	});
};

exports.infoDriver = function(req, res) {
	var data = {};
	data.EMAIL = req.session.passport.user.EMAIL
	rpc.makeRequest("aboutDriverUser", data, function(err, user) {
		console.log("User : " + JSON.stringify(user));
		if (err) {
			console.log("There is an error: " + err);
		} else {
			if (user.code == "200") {
				console.log("Everthing is fine!!!");
				res.send(user);
			} else {
				console.log("Did not delete. Try again");
			}
		}
	});
};

exports.getDriverVideoLink = function(req, res) {
	var data = {};
	data.EMAIL = req.session.passport.user.EMAIL
	rpc.makeRequest("getDriverVideoLink", data, function(err, user) {
		console.log("User : " + JSON.stringify(user));
		if (err) {
			console.log("There is an error: " + err);
		} else {
			if (user.code == "200") {
				console.log("Everthing is fine!!!");
				res.send(user);
			} else {
				console.log("Did not delete. Try again");
			}
		}
	});
};

exports.showDriverin10Mile = function(req, res) {
	var data = {
			latitude: req.param("latitude"),
			longitude: req.param("longitude")
	};
	rpc.makeRequest("showDriverin10Mile_queue", data, function(err, user) {
		console.log("User : " + JSON.stringify(user));
		if (err) {
			console.log("There is an error: " + err);
		} else {
				res.send(user);
		}
	});
};


exports.invalidDriverLogin = function(req, res){
	var user = {};
	user.errorInloginForm = true;
	user.errorMessage = "Invalid Username or password!! Please Try again.."
	res.render('loginDriver', {user:JSON.stringify(user)});
};

exports.invalidSessionDriverLogin = function(req, res){
	var user = {};
	user.errorInloginForm = true;
	user.errorMessage = "Invalid Session!! Please login again to proceed!!"
	res.render('loginDriver', {user:JSON.stringify(user)});
};

exports.uploadProfilePicDriver = function(req,res){
	if (req.session.passport != null && req.session.passport != "") {
		if (req.session.passport.user.EMAIL != ""	&& req.session.passport.user.EMAIL != null) {
			console.log(req);
			var fs = require('fs');
			fs.readFile(req.files.pofilepic.path, function (err, data) {
				fs.exists(req.files.pofilepic.path)
				var newPath = "/home/rakshithk/workspace/uberprototype/public/uploads/"+req.files.pofilepic.name;
				console.log("File newPath " + "");
				fs.writeFile(newPath, data, function (err) {
					data = {IMAGE_URL: "/public/uploads/"+req.files.pofilepic.name,ROW_ID:req.session.passport.user.ROW_ID}
					console.log("File Uploaded" + err);
					rpc.makeRequest("uploadProfilePicDriver", data, function(err, user) {
						console.log("User : " + JSON.stringify(user));
						if (err) {
							console.log("There is an error: " + err);
							res.redirect('/driverHome');
						} else {
							if (user.code == "200") {
								req.session.passport.user.IMAGE_URL = "/public/uploads/"+req.files.pofilepic.name;
								console.log("Everthing is fine!!!");
								res.redirect('/driverHome');
							} else {
								console.log("Did not Upload. Try again");
								res.redirect('/driverHome');
							}
						}
					});
				});
			});

		} else
			res.redirect("/invalidSessionDriverLogin");
	} else
		res.redirect("/invalidSessionDriverLogin");
};

exports.uploadDriverVideo = function(req, res) {
	var data = {};
	console.log("video link: "+ req.param("video"));
	if(req.param("video"))
		{
		data.VIDEO = req.param("video");
		data.ROW_ID = req.session.passport.user.ROW_ID;
		rpc.makeRequest("uploadDriverVideo", data, function(err, user) {
			console.log("User : " + JSON.stringify(user));
			if (err) {
				res.send({"statusCode" : 401});
			} else {
				if (user.code == "200") {
					console.log("Everthing is fine!!!");
					res.send({"statusCode" : 200});
				} else {
					res.send({"statusCode" : 401,
						"videoLink":req.session.passport.user.VIDEO_URL});
				}
			}
		});
		}
	else
		{
		res.send({"statusCode" : 401});
		}
};

exports.CreateDrivers = function(req,res){
	var data = req.body;
	rpc.makeRequest("CreateDrivers", data, function(err, user) {
		console.log("User : " + JSON.stringify(user));
		if (err) {
			console.log("There is an error: " + err);
		} else {
			if (user.code == "200") {
				console.log("Everthing is fine!!!");
				res.status(200).send(user);
			} else {
				console.log("Did not delete. Try again");
				res.status(404).send("Error");
			}
		}
	});
};

