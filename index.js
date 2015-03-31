var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var schedule = require('node-schedule');
var app = express();

var request = require('request-json');
var client = request.createClient('http://127.0.0.1:12000');

var ping = require ("net-ping");
var session = ping.createSession({timeout: 5000});
var serverStatus;

var server = app.listen(7200, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Running on http://%s:%s', host, port);
})

var io = require('socket.io').listen(server);

var pluginList = {};

io.on('connection', function(socket){
	socket.emit('connect');
	client.get('/plugins.json', function(err, res, body) {
		pluginList = body;
		socket.emit('pluginList', pluginList);
	});
});

var host = "127.0.0.1";

session.pingHost(host, function (error, target){
	if (error)
		serverStatus = error;
	else
		serverStatus = "Alive !";	
}); 

var j = schedule.scheduleJob({hour: 1, minute:0}, function(){
	session.pingHost(host, function (error, target){
		if (error)
			serverStatus = error;
		else
			serverStatus = "Alive !";	
	});
 });

app.set('view engine', 'jade');
app.set('views', './public');
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
	res.render('index', {servStatus: serverStatus});
});

app.post('/', function (req, res){
	exec('./script/update ' + req.body.updatelink, {uid: 1000},function (error, stdout, stderr){
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);

		if (error !== null){
			console.log('execute error: ' + error);
		}
	  
	})
	res.render('index', {servStatus: serverStatus});
});