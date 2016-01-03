var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api =  supertest('http://localhost:3000');

var request = require('superagent');
var baseURL = 'http://localhost:3000';

describe('Uber Test app', function(){
	
	it('Uber Server should respond', function (done){
		request.get(baseURL+'/').end(function assert(err,res){
			expect(err).to.not.be.ok;
			expect(res).to.have.property('status',200);
			done();
		});
	});
	
	it('Test if the Customer can login', function (done){
		request.post(baseURL+'/loginCustomers')
		  .send({ "username": "rakshithk@live.com", "password": "test" })
		  .set('Accept', 'application/text')
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',200);
			  done();
		  });
	});
	
	it('Test if the Untrusted Customer should not be able to login', function (done){
		request.post(baseURL+'/loginCustomers')
		  .send({ "username": "unknown@live.com", "password": "test" })
		  .set('Accept', 'application/text')
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',404);
			  done();
		  });
	});
	
	it('Test if the Driver can login', function (done){
		request.post(baseURL+'/loginDrivers')
		  .send({ "username": "driver0011@uber.com", "password": "test" })
		  .set('Accept', 'application/text')
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',200);
			  done();
		  });
	});
	
	it('Test if the Untrusted Driver should not be able to login', function (done){
		request.post(baseURL+'/loginDrivers')
		  .send({ "username": "unknown@uber.com", "password": "test" })
		  .set('Accept', 'application/text')
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',404);
			  done();
		  });
	});
	
	it('Test if the Admin can login', function (done){
		request.post(baseURL+'/loginAdmins')
		  .send({ "username": "admin@gmail.com", "password": "test" })
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',200);
			  done();
		  });
	});
	
	it('Test if the Admin cannot login with invalid password', function (done){
		request.post(baseURL+'/loginAdmins')
		  .send({ "username": "admin@gmail.com", "password": "test123" })
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',404);
			  done();
		  });
	});
	
	it('Test if the New Customer can Signup', function (done){
		var rand1 = Math.floor((Math.random() * 10) + 1);
		var rand2 = Math.floor((Math.random() * 10) + 2);
		request.post(baseURL+'/CreateCustomer')
		  .send({
			  "EMAIL": "customer"+rand1+rand2+"@live.com",
			  "PASSWORD": "test",
			  "FIRSTNAME": "CustomerFN"+rand1+rand2,
			  "LASTNAME": "CustomerLN"+rand1+rand2,
			  "MOBILENUMBER": "6692478890",
			  "LANGUAGE": "English",
			  "CREDITCARDNUMBER": "4111111111111111",
			  "CVV": "369",
			  "MONTH": "September",
			  "YEAR": "2017",
			  "ADDRESS": "817 N 10th Street Apt 117,",
			  "CITY": "San Jose",
			  "STATE": "CA",
			  "ZIPCODE": "95112",
			  "IMAGE_URL":"/images/default_profile_pic.jpeg",
			  "SSN_ID" : "4728947233"
			})
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',200);
			  done();
		  });
	});
	
	it('Test if the New Driver can Signup', function (done){
		var rand1 = Math.floor((Math.random() * 10) + 1);
		var rand2 = Math.floor((Math.random() * 10) + 2);
		request.post(baseURL+'/CreateDrivers')
		  .send({
			  "EMAIL": "driver"+rand1+rand2+"@uber.com",
			  "PASSWORD": "test",
			  "FIRSTNAME": "DriverF"+rand1+rand2,
			  "LASTNAME": "DriverL"+rand1+rand2,
			  "MOBILENUMBER": "6692478890",
			  "CARMODEL": "Tesla",
			  "CARCOLOR": "Black",
			  "CARYEAR": "2015",
			  "ADDRESS": "817 N 10th Street Apt 117",
			  "CITY": "San Jose",
			  "STATE": "CA",
			  "ZIPCODE": "95112",
			  "IMAGE_URL":"/images/default_profile_pic.jpeg",
			  "VIDEO_URL":"https://www.youtube.com/watch?v=osUEUEQaPzU",
			  "SSN_ID" : "4728947233"
			})
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',200);
			  done();
		  });
	});
	
	it('Test if the Search Drivers With 10 Mile Radius is working', function (done){
		var rand1 = Math.floor((Math.random() * 10) + 1);
		var rand2 = Math.floor((Math.random() * 10) + 2);
		request.post(baseURL+'/showDriverin10Mile')
		  .send({
				latitude: 37.3562644,
				longitude: -121.8926244
		  		})
		  .end(function(err, res){
			  expect(err).to.not.be.ok;
			  expect(res).to.have.property('status',200);
			  done();
		  });
	});

});


/*var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Hello, World!');
});

// *** api routes *** //
router.get('/blobs', findAllBlobs);
router.get('/blob/:id', findBlobById);
router.post('/blobs', addBlob);
router.put('/blob/:id', updateBlob);
router.delete('/blob/:id', deleteBlob);

it('should list ALL blobs on /blobs GET', function(done) {
	  chai.request(server)
	    .get('/blobs')
	    .end(function(err, res){
	      res.should.have.status(200);
	      done();
	    });
	});

module.exports = router;
*/