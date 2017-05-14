/*
 *
 *
 *
 */
 
 /*
 gc.register();gc.createNewRoom({roomName: "testRoom", mapId: 2});
 gc.gameStart();
 gc.joinRoom({roomId: "0"});
 */
var GameControllerModel = Backbone.Model.extend( {
	initialize: function(){

		this.regAudio();
		this.jqueryLibToBackbone();
		this.createConn();
	},
	defaults: function(){
		return {
			username: "Default Name",
			stage: new createjs.Stage("background"),
			audioPath: "../audios/",
			audios: [
				{src:"heart/bomb.mp3", id:"bomb"},
				{src:"heart/charge_2.mp3", id:"charge"},
				{src:"heart/attack.mp3", id:"attack"}		
			],
			roomId: "",
			entityColl: null
		}	
	},
	regAudio: function () {
		createjs.Sound.registerSounds(
			this.get("audios"), this.get("audioPath")
		);
	},
	jqueryLibToBackbone: function () {
		Backbone.$ = $;
	},
	createConn: function () {
		this.set("socket", io.connect());
		Backbone.socket = this.get("socket");
		this.get("socket")
			.on("log", params => {console.log(params)})
		;		
	},
	createNewRoom:function (params) {
		this.get("socket").emit("create new room", {
			roomName: params.roomName, 
			mapId: params.mapId
		});
	},
	joinRoom:function (params) {
		this.get("socket").emit("join room", {
			roomId: params.roomId
		});
	},
	leaveRoom:function () {
		this.get("socket").emit("leave room");
	},
	register:function () {
		let _username = this.get("username");
		this.get("socket").emit("register user", {username: _username});
	},
	setName: function(name){
		this.set("username", name);
	},
	/*modelBehaviours (){
		this.fetch({
			success: (model, response)
		})
	}*/
	gameStart:function(level){
		this.set("entityColl", new EntityColl);
		this.get("entityColl").create({
			x: 100,
			y: 100,
			type: "PLAYER"
		});
	},
	
	
	mapVariation:function(level){
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
		}
	},
	
	sprites: {
		matchman: new createjs.Sprite(new createjs.SpriteSheet({
			framerate: 10,      // Add the speed of the spritesheet
			images: ["../images/fm_fire.png"],
			frames: {
                height: 50,
                width: 50,
                regX: 25,
                regY: 25,
                count: 4
			},
			animations: {
				lightMyFire: [0, 3],
			},			
		})),
		tile: new createjs.Sprite(new createjs.SpriteSheet({
			images: ["../images/map.png"],
            frames: {
                height: 50,
                width: 50,
                regX: 0,
                regY: 0,
                count: 3
            }			
		})),
	}
	
});

var gc = new GameControllerModel();

var EntityModel = Backbone.Model.extend( {
	initialize: function(params) {
		
	},
	defaults: function () {
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
			type: "",
		}
	}
});


var CharaModel = EntityModel.extend( {
	initialize:function (params) {

	},
	defaults:function () {
		return Object.assign (
			EntityModel.prototype.defaults(), {
			speed: 5,
			isFire: false,
			fireTimer: 0,
			atkTimer: 0,
			
		});
	}
	
});

var MatchmanModel = CharaModel.extend( {
	initialize: function (params) {
		
	}	
});

var PlayerModel = MatchmanModel.extend( {
	initialize:function (params, opt) {
		
	},
	defaults: function () {
		return Object.assign (
			MatchmanModel.prototype.defaults(), {
			type: "PLAYER",
		});
	}
});

var EnemyModel = MatchmanModel.extend( {
	initialize (params) {

	}	
});

var CoupleModel = CharaModel.extend( {
	initialize (params) {

	}	
});

var LittleGirlModel = CharaModel.extend( {
	initialize (params) {

	}	
});

var ItemModel = EntityModel.extend( {
	initialize (params) {

	}
});

var FireModel = EntityModel.extend( {
	initialize (params) {

	}
});

/*class EntityColl extends Backbone.Collection {
	constructor (params) {
		super (params);
		_.bindAll(this, "createModel");
		this.ioBind("create", this.createModel, this);
	}
	createModel (data) {
		console.log ("Chara created @id#", data.id);
		this.add(data);
	}
	url () {
		return "the_match";
	}
	model (params) {
		return new PlayerModel(params, null);
		switch (params.type) {
			case "PLAYER":
				return new PlayerModel(params);
			break;
			default:
				return null;
		}
	}
}*/
var EntityColl = Backbone.Collection.extend({
	model: function (params){
		switch (params.type) {
			case "PLAYER":
				return new PlayerModel(params);
			break;
			default:
				return null;
		}	
	},
	url: "the_match",
	createModel: function (data) {
		console.log ("Chara created @id#"+ data.id);
		this.add(data);		
	},	
	initialize: function () {
		_.bindAll(this, "createModel");
		this.ioBind("create", this.createModel, this);
	}
});

var EntityView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this,"on_server_update_model");
		this.model.ioBind("update",this.on_server_update_model,this);					
	},
	on_server_update_model: function (data) {
		console.log(JSON.stringify(data));
	},

	
});
//	a class for synchronizing server time and generate a higher speed clock for local use
function LocalTimer(deltaTimeMSec, maxLocalSubTick)
{	//
	//	deltaTimeMSec - time betwen ticks
	//	maxLocalSubTick - maximum no subticks in a tick, >=1
	//
	//	maximum number of events per tick is determined by maxLocalSubTick; when performance of system is low, the number of events per tick will be reduced

	this.localSubTick = 0;
	this.maxLocalSubTick = maxLocalSubTick;
	
	this.normDeltaTimeMSec = deltaTimeMSec;
		//	nominal value of timeout to next tick
		
	this.maxDeltaTimeFactor=1.95;
	this.maxDeltaTimeMSec =  this.normDeltaTimeMSec*this.maxDeltaTimeFactor;
		//	maximum allowable timeout to next tick
		
	this.minDeltaTimeFactor=0.05;
	this.minDeltaTimeMSec =  this.normDeltaTimeMSec*this.minDeltaTimeFactor;
		//	minimum allowable timeout to next tick
	
	this.deltaTimeMSecAdjusted=this.normDeltaTimeMSec;
		//	timeout to next tick after adjustment
		
	this.adjustFactor=0.5;	//	this affects the amount of time in adjustment - must be from 0 to 1, and larger means faster adjustment
		
	_.extend(this, Backbone.Events);
	
	this.lastHandlerTime=-1;
	this.currEvent = { currTick:0, lastTick:0};	//	the last or current tick Event object from LocalTimer
	
	this.timerHandler = function(timer)
	{	var currTick=timer.nextTick-1+timer.localSubTick/timer.maxLocalSubTick;
	
		var currTime=performance.now();
		//	given currTime, calculate the value of nextTick and localSubTick 

		while (currTime > timer.nextTime)
		{	timer.lastTime = timer.nextTime;
			timer.nextTime = timer.nextTime + timer.deltaTimeMSecAdjusted;
			timer.timeMSecPerSubTick = timer.deltaTimeMSecAdjusted/timer.maxLocalSubTick;
			timer.deltaTimeMSecAdjusted=timer.normDeltaTimeMSec;
			timer.nextTick++;
		}
		//	round to the next larger localSubTick
		var minElapsedTimeInTick=currTime - timer.lastTime + 4;		//	setTimeout sleeps for at least 4 ms
		timer.localSubTick = Math.trunc(minElapsedTimeInTick / timer.timeMSecPerSubTick)+1;
		var waitTime = timer.localSubTick * timer.timeMSecPerSubTick + timer.lastTime - currTime;
		
		//console.log("tick="+timer.nextTick+" subtick="+timer.localSubTick+" waitTime="+waitTime);
		
		setTimeout(	timer.timerHandler, waitTime, timer);
		
		var event={};
		event.target=timer;
		event.type="LocalTimerTick";
		event.paused=false;
		event.time=currTick*timer.normDeltaTimeMSec;
		if (timer.lastHandlerTime==-1)
			event.delta=0;
		else
			event.delta=event.time-timer.lastHandlerTime;
		timer.lastHandlerTime = event.time;
		event.currTick = currTick;
		event.lastTick = timer.currEvent.currTick;
		
		timer.currEvent = event;
		timer.trigger("tick",event);
	}

	//	for printing debug messages
	this.lastTick=0;
	this.lastTime=0;
	this.maxAvgDeltaTime=0;
	this.minAvgDeltaTime=100000;
	
	this.syncServer=function(currTick)
	{	var currTime=performance.now();
		var tickdiff = this.nextTick - currTick;
		var timediff = this.nextTime - tickdiff*this.normDeltaTimeMSec - currTime;
		this.deltaTimeMSecAdjusted =  this.normDeltaTimeMSec - timediff*this.adjustFactor;
								
		if (this.deltaTimeMSecAdjusted<this.minDeltaTimeMSec)
		{	this.deltaTimeMSecAdjusted = this.minDeltaTimeMSec;
		}
		if (this.deltaTimeMSecAdjusted>this.maxDeltaTimeMSec)
		{	this.deltaTimeMSecAdjusted = this.maxDeltaTimeMSec;
		}
		
		console.log("server tick="+currTick+" next local tick="+this.nextTick+" next timeout="+this.deltaTimeMSecAdjusted);

		var timeDiff=currTime - this.lastTime;
		var tickDiff=currTick - this.lastTick;
		var avgDeltaTime = timeDiff/tickDiff;
		this.maxAvgDeltaTime = (this.maxAvgDeltaTime<avgDeltaTime)?avgDeltaTime:this.maxAvgDeltaTime;
		this.minAvgDeltaTime = (this.minAvgDeltaTime>avgDeltaTime)?avgDeltaTime:this.minAvgDeltaTime;
						
		console.log("delta time from server="+avgDeltaTime+" min="+this.minAvgDeltaTime+" max="+this.maxAvgDeltaTime);
						
		this.lastTime = currTime;
		this.lastTick = currTick;
	}
	
	this.getTickPerSecond = function()	{	return 1/this.normDeltaTimeMSec*1000;	}
	
	this.getTickEventPerSecond = function()
		{	return this.getTickPerSecond()*this.maxLocalSubTick;
		}
	
	this.start= function(startTick, handler)
		{	//	start the timer
			
			//	startTick - the starting tick value of this LocalTimer
			//	return true if successfully started, otherwise return false

			if (this.maxLocalSubTick<1)
			{	//	error in this value, hence cannot start
				return false;
			}
			
			this.nextTick = startTick+1;			// 	tick value of the coming tick
			this.lastTime = performance.now();	//	time of this tick
			this.nextTime = this.lastTime + this.deltaTimeMSecAdjusted;	//	time of coming tick
			this.timeMSecPerSubTick=this.deltaTimeMSecAdjusted/this.maxLocalSubTick;	//	duration for one subtick

			this.on("tick",handler);
			setTimeout( this.timerHandler, this.timeMSecPerSubTick, this);
			return true;
		}
}