var Characters = require('./Characters.js');

var app = require('express')();
var http = require('http').Server(app);
var io = require ('socket.io')(http);

var port = process.env.PORT || 7200;

app.get('/', function(req, res){
	res.send("-- Server is running on " + port + " --");
	CharServer();
});

function CharServer (){
	io.on ('connection', function (socket){

		var Char = new Characters.Character(socket);
		StartEvents(Char, socket);
	});
};

function StartEvents (Char, socket){
	
	socket.on ("CharEnterReq", function(){
		console.log ('New connection');
		socket.emit("CharEnterRes");
	});

	socket.on ("LoadReq", Char.Load);

	socket.on ("CreateReq", Char.Create);
	socket.on ("DeleteReq", Char.Delete);

	socket.on ('disconnect', function(){
	console.log("Client disconnected");
	});	
};

module.exports.InitializeServer = CharServer;