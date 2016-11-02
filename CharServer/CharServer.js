var Characters = require('./Characters.js');

var app = require('express')();
var http = require('http').Server(app);
var io = require ('socket.io');

var serverunning = false;

var port = process.env.PORT || 7200;

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

function InitializeServer (){
    if(!serverunning){
    
	io = io.listen(http, false);

	io.on ('connection', function (socket){

		var Char = new Characters.Character(socket);
		StartEvents(Char, socket);
	});
    
    serverunning = true;
	console.log('Server is running on ' + port);
    };
};

app.get('/', function(req, res){
	res.send("<h1>Server is running on " + port + "</h1>");
	InitializeServer();
});

http.listen(port);