var Characters = require('./Characters.js');

var app = require('express')();
var http = require('http').Server(app);
var ioo = require ('socket.io');

var port = process.env.PORT || 7200;

app.get('/', function(req, res){
	res.send("<h1>Server is running on " + port + "</h1>");
	InitializeServer();
});

function InitializeServer (){

	var io = ioo.listen(http, false);

	io.on ('connection', function (socket){

		var Char = new Characters.Character(socket);
		StartEvents(Char, socket);
	});

	console.log('Server is running on ' + port);
};

function StartEvents (Char, socket){
	
	socket.on ("EnterCharReq", function(){
		console.log ('New connection');
		socket.emit("EnterCharRes");
	});

	socket.on ("LoadReq", Char.Load);

	socket.on ("CreateReq", Char.Create);
	socket.on ("DeleteReq", Char.Delete);

	socket.on ('disconnect', function(){
	console.log("Client disconnected");
	});	
};

http.listen(port);