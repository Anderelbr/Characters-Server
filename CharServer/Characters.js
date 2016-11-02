var MongoDB = require("mongodb").MongoClient;
var config = require("./config.js");

var shortid = require("shortid");

function ConnectDB (callback){
	MongoDB.connect(config.dburl, function(err, db){
		if(err)
			throw err;
		callback(db);
	});
};

function Character (socket){

	var MaxChars = 8;

	this.Load = function (data){
		ConnectDB(function (db){

			db.collection("characters").find({id: data.accid}).toArray(function(err, result){

				if(result.length > 0){
					var allcharacters = {characters: []};
					console.log("Success, this account have " + result.length + " characters");
					
					for (var i = 0; i < result.length; i++){
						allcharacters.characters.push(result[i]);
					};

					if (allcharacters.characters.length > 0){
						socket.emit ("LoadRes", {character:allcharacters.characters, numchars: allcharacters.characters.length, opcode: "0"});
					}
				}else{

					console.log("Not have characters");
					socket.emit ("LoadRes", {opcode: "1"});
				};

				db.close();
			});
		});
	}

	this.Create = function (data){
		var NewChar = {name: data.name, money: 100, level: 1, location: "Gori Village", pos: "4.86,5,120.35", objid: data.objid, moveSpeed: 6, rotSpeed: 100, accid: data.accid, charid: shortid.generate()};

		ConnectDB(function (db){
			db.collection("characters").find({name:NewChar.name}).toArray(function(err, result){

				if(err)
					throw err;

				if (result.length < 1){
					db.collection("characters").insertOne(NewChar, function(err, result){
						if (err)
							throw err;

						socket.emit ("CreateRes", {opcode: '0'});

						console.log(result);
						db.close();
					});
				}else{
					socket.emit("CreateRes", {message: 'Sorry this character already exist!', title: 'Server', opcode: '1'});
					console.log("Sorry this character already exist!");
					
					db.close();
				};
			});
		});
	}

	this.Delete = function (data){

		var User = {accid:data.accid, charid:data.charid};

		ConnectDB(function (db){
			db.collection("characters").deleteOne({charid:User.charid}, function(err, result){
				if(err)
					throw err;		
				
				socket.emit("LoadRes", {opcode:"2"});
				db.close();
			});
		});
	}
}

module.exports.Character = Character;