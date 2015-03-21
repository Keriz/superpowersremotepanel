var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var schedule = require('node-schedule');
var app = express();

var ping = require ("net-ping");
var session = ping.createSession({timeout: 5000});
var serverStatus;

var host = "192.168.100.124";

session.pingHost(host, function (error, target){
	if (error)
		serverStatus = error;
	else
		serverStatus = "Alive";	
}); 

var j = schedule.scheduleJob({hour: 1, minute:0}, function(){
	session.pingHost(host, function (error, target){
		if (error)
			serverStatus = error;
		else
			serverStatus = "Alive";	
	});
 });

app.set('view engine', 'jade');
app.set('views', './public/');
app.use(bodyParser());

app.get('/', function (req, res){
	res.render('index', {servStatus: serverStatus});
});

app.post('/', function (req, res){
	exec('./script/update ' + req.body.updatelink, function (error, stdout, stderr){
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);

		if (error !== null){
			console.log('exec error: ' + error);
		}
	  res.render('index', {servStatus: serverStatus});
	})


});

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Running on http://%s:%s', host, port);
})