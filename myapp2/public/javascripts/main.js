var gc;

const init = () => {
	gc = new GC();
}

function GC() {
	//render
	this.stage = new createjs.Stage("background");
	
	//audios
	this.audioPath = "../audios";
	this.audios = [
		{src:"heart/bomb.mp3", id:"bomb"},
		{src:"heart/charge_2.mp3", id:"charge"},
		{src:"heart/attack.mp3", id:"attack"}		
	];
	this.regAudio = function (){
		createjs.Sound.registerSounds(this.audios, this.audioPath);
	}
	
	
	//info
	this.roomId = "";
	this.entities = [];
	this.createConn = function () {
		this.socket = io.connect();
		this.socket
			.on("log", params => {console.log(params)})
		;		
	}
	this.createNewRoom = function (params) {
		this.socket.emit("create new room", {
			roomName: params.roomName, 
			mapId: params.mapId
		});
	}
	this.joinRoom = function (params) {
		this.socket.emit("join room", {
			roomId: params.roomId
		});
	}
	this.leaveRoom = function () {
		this.socket.emit("leave room");
	}
	this.register = function (params) {
		this.socket.emit("register user", {username: params.username});
	}	
	
	// map
	this.mapVariation = function(level){
		switch(level){
			case 1:
				return [
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
					[0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
					[0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 0],
					[0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
					[0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 0],
					[0, 1, 1, 0, 1, 1, 0, 1, 1, 2, 0, 1, 1, 1, 1, 0],
					[0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
					[0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]					
				];
			break;
			default:
				return null;
		}
	}
	
	
	// init
	this.createConn();
}


function Entity (params) {
	this.defaults = function () {
		return {
			name: "",
			x: 0,
			y: 0,
			regX: 0,
			regY: 0,
			rotation: 0,
			height: 34,
			width: 34,
			sprite: null,
			type: ""
		};
	};
	params = Object.assign(this.defaults(), params);
	
	this.name = params.name;
	this.x = params.x;
	this.y = params.y;
	this.regX = params.regX;
	this.regY = params.regY;
	this.rotation = params.rotation;
	this.height = params.height;
	this.width = params.width;
	this.sprite = params.sprite;
	this.type = params.type;
	

}

function Chara (params) {
	this.defaults = function () {
		return {
			speed: 5,
			isFire: false,
			fireTimer: 0,
			atkTimer: 0,	
		};
	};
	params = Object.assign(this.defaults(), params);
	
	
}