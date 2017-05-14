/*
 *
 *
 *
 */

function Matchman (stage){
	this.spritesheet = {
		framerate: 10,      // Add the speed of the spritesheet
		"images": ["../images/fm_fire.png"],
		"frames": [
			[0, 0, 50, 50],
			[50, 0, 50, 50],
			[100, 0, 50, 50],
			[150, 0, 50, 50],
		],
		"animations": {
			"lightMyFire": [0, 3],
		},
	};
	this.spritesheettp = new createjs.SpriteSheet(this.spritesheet);
	this.sprite = new createjs.Sprite(this.spritesheettp);
	stage.addChild(this.sprite);
	this.sprite.regX = this.sprite.regY = 25;
	
	this.sprite.on("click", event => {		
		createjs.Sound.play("bomb");
		event.target.gotoAndPlay("lightMyFire");
	}, null, false, {count:3});
	
	this.sprite.addEventListener("animationend", event => {
		event.target.stop();
	});
	this.sprite.addEventListener("mousedown", event => {
		createjs.Sound.play("charge");
	});
	
	this.sprite.addEventListener("pressup", event => {
		createjs.Sound.stop("charge");
		createjs.Sound.play("attack");
		this.setDest({x: event.stageX, y: event.stageY});
	});

	this.x = this.sprite.x;
	this.y = this.sprite.y;

	console.log(this);
	
	this.setDest = function(_pos){
		this.x = _pos.x;
		this.y = _pos.y;
	}
	this.move = function(_dx = 50, _dy = 50){
		var destx = this.x;
		var cx = this.sprite.x;
		var desty = this.y;
		var cy = this.sprite.y;
		if (destx > cx){
			this.sprite.x = upperbound(this.sprite.x + _dx, destx);
		} else if (destx < cx) {
			this.sprite.x = lowerbound(this.sprite.x - _dx, destx);
		} 
		
		if (desty > cy){
			this.sprite.y = upperbound(this.sprite.y + _dy, desty);
		} else if (desty < cy) {
			this.sprite.y = lowerbound(this.sprite.y - _dy, desty);
		} 
	
		function upperbound(_val, _lim){
			return _val > _lim ? _lim : _val;
		}
		function lowerbound(_val, _lim){
			return _val < _lim ? _lim : _val;
		}
	}
}

