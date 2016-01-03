//Clustering
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

	for (var i = 0; i < numCPUs -2; i++) {
		console.log("Spawning Cluster Thread ==> " + i + " execution!!")
		cluster.fork();
	}
	
	cluster.on('exit', function(worker, code, signal) {
		console.log('Cluster Thread ==> ' + worker.process.pid + ' has exited !!');
	});
	
	cluster.on('online', function() {
		  console.log("Workers are Online and waiting for process")
		});


} else {
	require("./app.js");
}