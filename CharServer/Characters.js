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

			db.collection("characters").find({id: data.id}).toArray(function(err, result){

				if(result.length > 0){

					console.log("Success, this account have " + result.length + " characters");
					
					for (var i = 0; i < result.length; i++){
						socket.emit ("LoadRes", {character:result[i], opcode: "0"});
					};
				}else{

					console.log("Not have characters");
					socket.emit ("LoadRes", {opcode: "1"});
				};

				db.close();
			});
		});
	}

	this.Create = function (data){
		var NewChar = {name: data.name, race: data.race, class: data.class, sex: data.sex, money: data.money, level: data.level, pos: data.pos, id: data.id, charid: shortid.generate()};

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

		var User = {id:data.id, charid:data.charid};

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