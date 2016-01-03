var adminAccountOperations = require('./adminAccountOperations');
var amqp = require('amqp');
var connection = amqp.createConnection({
	host : '127.0.0.1'
});
var rpc = new (require('../rpc/amqprpc'))(connection);

exports.loginCustomers = function(req,res){
	var data = {};
	data.EMAIL = req.body.username;
	data.PASSWORD = req.body.password;
	rpc.makeRequest("verifyCustomer", data,
			function(err, user) {
		console.log("verifyCustomer : "+ JSON.stringify(user));
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

exports.signUpCustomer = function(req, res){
	res.render('Sign_up_Customer', { title: 'HOME' });
}

exports.customerHome = function(req, res){
	console.log("Session Set by Passport !!! ==>  " + JSON.stringify(req.session));
	if (req.session.passport != null && req.session.passport != "") {
		if (req.session.passport.user.EMAIL != ""	&& req.session.passport.user.EMAIL != null) {
			res.render('customerHome', {
				user : JSON.stringify(req.session.passport.user)
			});
		} else
			res.redirect("/invalidCustomerLogin");
	} else
		res.redirect("/invalidCustomerLogin");
}

exports.customerLoginPage = function(req, res) {
	if (req.session.passport != null && req.session.passport != "") {
		console.log("Existing Session on Passport !!! ==>  "
				+ JSON.stringify(req.session));
		if (req.session.passport.user.EMAIL != ""
			&& req.session.passport.user.EMAIL != null) {
			res.redirect('/customerHome');
		} else
			res.render('loginCustomer', {
				user : JSON.stringify({})
			});
	} else
		res.render('loginCustomer', {
			user : JSON.stringify({})
		});
};

exports.adminHome = function(req, res) {
	console.log("Session Set by Passport !!! ==>  "
			+ JSON.stringify(req.session));
	if (req.session.passport != null && req.session.passport != "") {
		if (req.session.passport.user.EMAIL != ""
			&& req.session.passport.user.EMAIL != null) {
			res.render('customerHome', {user : JSON.stringify(req.session.passport.user)});
		} else
			res.redirect("/invalidSessionCustomerLogin");
	} else
		res.redirect("/invalidSessionCustomerLogin");
};

exports.customerSignUp = function(req, res) {
	console.log("Request for Account Creation ==> " + JSON.stringify(req.body));
	var data = {};
	var zipCheck = false;
	var creditCheck = false;
	var stateAbrevCheck = false;
	var stateCheck = false;
	var mobileCheck = false;
	var errorMessage = "";
	if (req.param("email") && req.param("password") && req.param("firstName")
			&& req.param("lastName") && req.param("mobileNumber")
			&& req.param("language") && req.param("creditCardNumber")
			&& req.param("cvv") && req.param("month") && req.param("year")
			&& req.param("address") && req.param("city") && req.param("state")
			&& req.param("zipCode")) {
		var zipCodeCheck = /^\d{5}(?:[-]\d{4})?$/;	
		//Regular expression check for valid visa card
		var CreditCardCheck = /^4[0-9]{12}(?:[0-9]{3})?$/;
		//Regular expression check for valid state abbreviations and full state names
		var stateAbbrevCheck = /^(AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NB|NC|ND|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)$/i;	
        var stateFullCheck = /^(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New\sHampshire|New\sJersey|New\sMexico|New\sYork|North\sCarolina|North\sDakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode\sIsland|South\sCarolina|South\sDakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West\sVirginia|Wisconsin|Wyoming)/;
		var mobileNumberCheck = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/;
		if(zipCodeCheck.test(req.param("zipCode")))
			{
			zipCheck = true;
			}
		if(CreditCardCheck.test(req.param("creditCardNumber")))
		{
			creditCheck = true;
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

		if(zipCheck && creditCheck && (stateAbrevCheck||stateCheck) && mobileCheck)
			{
		data.EMAIL = req.param("email");
		data.PASSWORD = req.param("password");
		data.FIRSTNAME = req.param("firstName");
		data.LASTNAME = req.param("lastName");
		data.MOBILENUMBER = req.param("mobileNumber");
		data.LANGUAGE = req.param("language");
		data.CREDITCARDNUMBER = req.param("creditCardNumber");
		data.CVV = req.param("cvv");
		data.MONTH = req.param("month");
		data.YEAR = req.param("year");
		data.ADDRESS = req.param("address");
		data.CITY = req.param("city");
		data.STATE = req.param("state");
		data.ZIPCODE = req.param("zipCode");
		rpc.makeRequest("addCustomer", data, function(err, user) {
			console.log("User : " + JSON.stringify(user));
			if (err) {
				res.redirect("/customerSignUp");
			} else {
				if (user.code == "200") {
					console.log("Everthing is fine!!!");
					res.redirect("/Log_In");
				} else {
					console.log("There was an error: "+user.err);
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
		if (!creditCheck)
			{
		    errorMessage+="Credit Card is incorrect format. Needs to be Visa Format\n";
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
	} else {
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
	data.CITY = req.param("city");
	data.ZIPCODE = req.param("zip");
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
		if(!zipCodeCheck.test(req.param("zip")))
			{
			zipCheck = false;
			}
		}
	if(req.param("state"))
	{
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
	if(zipCheck && stateAbrevCheck && stateCheck && phoneCheck)
		{
	rpc.makeRequest("updateCustomer", data, function(err, user) {
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
		    errorMessage+="Not a valid US phone Number\n";
			}
			res.send({"statusCode" : 402,
				"errorMessage": errorMessage});
			}

};

exports.deleteCustomer = function(req, res) {
	var data = {};
	data.EMAIL = req.session.passport.user.EMAIL
	rpc.makeRequest("deleteCustomer", data, function(err, user) {
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

exports.infoCustomer = function(req, res) {
	var data = {};
	data.EMAIL = req.session.passport.user.EMAIL
	rpc.makeRequest("aboutUser", data, function(err, user) {
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

exports.getCreditCardInfo = function(req, res) {
	var data = {};
	data.creCard = req.param("creCard");
	rpc.makeRequest("getCreditCardInfo", data, function(err, user) {
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

exports.invalidCustomerLogin = function(req, res) {
	var user = {};
	user.errorInloginForm = true;
	user.errorMessage = "Invalid Username or password!! Please Try again.."
		res.render('loginCustomer', {user : JSON.stringify(user)
		});
};

exports.invalidSessionCustomerLogin = function(req, res) {
	var user = {};
	user.errorInloginForm = true;
	user.errorMessage = "Invalid Session!! Please login again to proceed!!"
		res.render('loginCustomer', {user : JSON.stringify(user)
		});
};

exports.uploadProfilePic = function(req,res){
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
					rpc.makeRequest("uploadProfilePic", data, function(err, user) {
						console.log("User : " + JSON.stringify(user));
						if (err) {
							console.log("There is an error: " + err);
							res.redirect('/customerHome');
						} else {
							if (user.code == "200") {
								req.session.passport.user.IMAGE_URL = "/public/uploads/"+req.files.pofilepic.name;
								console.log("Everthing is fine!!!");
								res.redirect('/customerHome');
							} else {
								console.log("Did not Upload. Try again");
								res.redirect('/customerHome');
							}
						}
					});
				});
			});

		} else
			res.redirect("/invalidSessionCustomerLogin");
	} else
		res.redirect("/invalidSessionCustomerLogin");
};


exports.CreateCustomer = function(req,res){
	var data = req.body;	
	rpc.makeRequest("CreateCustomer", data, function(err, user) {
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


exports.uploadEventRidePic = function(req,res){
	if (req.session.passport != null && req.session.passport != "") {
		if (req.session.passport.user.EMAIL != ""	&& req.session.passport.user.EMAIL != null) {
			console.log(req);
			var fs = require('fs');
			fs.readFile(req.files.eventRidepic.path, function (err, data) {
				fs.exists(req.files.eventRidepic.path)
				var newPath = "/home/rakshithk/workspace/uberprototype/public/uploads/"+req.files.eventRidepic.name;
				console.log("File newPath " + "");
				fs.writeFile(newPath, data, function (err) {
					data = {IMAGE_URL: "/public/uploads/"+req.files.eventRidepic.name,ROW_ID:req.session.passport.user.ROW_ID}
					console.log("File Uploaded" + err);
					rpc.makeRequest("uploadEventRidePic", data, function(err, user) {
						console.log("User : " + JSON.stringify(user));
						if (err) {
							console.log("There is an error: " + err);
							res.redirect('/customerHome');
						} else {
							if (user.code == "200") {
								req.session.passport.user.IMAGE_URL = "/public/uploads/"+req.files.eventRidepic.name;
								console.log("Everthing is fine!!!");
								res.redirect('/customerHome');
							} else {
								console.log("Did not Upload. Try again");
								res.redirect('/customerHome');
							}
						}
					});
				});
			});

		} else
			res.redirect("/invalidSessionCustomerLogin");
	} else
		res.redirect("/invalidSessionCustomerLogin");
};