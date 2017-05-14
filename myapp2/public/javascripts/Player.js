/*
 *
 *
 *
 */
const Matchman1 = ({x = 0, y = 0, name = ""}) => {
	let state = {
		x: x,
		y: y,
		name: name,
		speed: 100,
		position: 0,
		sprite: new createjs.Sprite( new createjs.SpriteSheet({
            animations: {
                stand: [0],
                fire: [1, 3]
            },
            images: ["images/fm_fire.png"],
            frames: {
                height: 50,
                width: 50,
                regX: 25,
                regY: 25,
                count: 4
            }
        }))
	}
	matchmanBehaviour(state).click();
	matchmanBehaviour(state).animationend();
	matchmanBehaviour(state).mousedown();
	matchmanBehaviour(state).pressup();
	
	return Object.assign(
		{},
		matchmanBehaviour(state),
		state
	)
	
}

const Player = (params) => {
	return Object.assign(
		{},
		Matchman1(params)
	)
}
const matchmanBehaviour = (state) => ({
	click: () => {	
		state.sprite.on("click", (event,data) => {		
			createjs.Sound.play("bomb");
			event.target.gotoAndPlay("fire");
		}, null, false, {count:3});
	},
	animationend: () => {
		state.sprite.addEventListener("animationend", event => {
			event.target.stop();
		});
	},
	mousedown: () => {
		state.sprite.addEventListener("mousedown", event => {
			createjs.Sound.play("charge");
		});		
	},
	pressup: () => {
		state.sprite.addEventListener("pressup", event => {
			createjs.Sound.stop("charge");
			createjs.Sound.play("attack");
			matchmanBehaviour(state).setDest({x: event.stageX, y: event.stageY});
		});		
	},
	setDest: (_pos) => {
		state.x = _pos.x;
		state.y = _pos.y;
	},
	move: (_dx = 50, _dy = 50) => {
		let destx = state.x,
			cx = state.sprite.x,
			desty = state.y,
			cy = state.sprite.y;
		if (destx > cx){
			state.sprite.x = upperbound(state.sprite.x + _dx, destx);
		} else if (destx < cx) {
			state.sprite.x = lowerbound(state.sprite.x - _dx, destx);
		} 
		
		if (desty > cy){
			state.sprite.y = upperbound(state.sprite.y + _dy, desty);
		} else if (desty < cy) {
			state.sprite.y = lowerbound(state.sprite.y - _dy, desty);
		} 
	
		function upperbound(_val, _lim){
			return _val > _lim ? _lim : _val;
		}
		function lowerbound(_val, _lim){
			return _val < _lim ? _lim : _val;
		}
	}
})


const GameController1 = (params) => {
	let state = {
		players: [],
		stage: new createjs.Stage(params.stageCanvas),
		audioPath: "../audios/",
		audios: [
			{src:"heart/bomb.mp3", id:"bomb"},
			{src:"heart/charge_2.mp3", id:"charge"},
			{src:"heart/attack.mp3", id:"attack"}		
		],
		gl: null, 
		tick: () => {
			console.log("tick");
			state.players.forEach((item)=>{
				item.move();
			});
			state.stage.update();
		}
	}
	// init functions
	soundBehaviour(state).regAudio();
	stageBehaviour(state).listenToTick();
	
	return Object.assign(
		{},
		state,
		gcBehaviour(state),
		soundBehaviour(state)
	)
}

const gcBehaviour = (state) => ({
	addPlayer: (player) => {
		state.players.push(player);
		state.stage.addChild(player.sprite);
		return "Added Player: " + player.name;
	},
	findPlayer: (name) => state.players.find(player => player.name === name),
	addLive2D: (gl) => {state.gl = gl;} 
})

const soundBehaviour = (state) => ({
	regAudio: () => {createjs.Sound.registerSounds(state.audios, state.audioPath);}
})

const stageBehaviour = (state) => ({
	listenToTick: () => {createjs.Ticker.addEventListener("tick", state.tick);}
	
})

var gc1 = GameController1;
//gc.regAudio();


//walkMatrix = map1.map((grid)=>grid > 0 ? 1 : 0)