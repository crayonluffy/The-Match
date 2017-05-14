
function startGame2() {

    'use strict';
    var $container, $infoContainer,$EnemyInfoContainer, canvas, infoCanvas, enemyInfoCanvas, stage, infoStage, enemyInfoStage,
        canvasW, canvasH, PlayerText, EnemyText, selectMenu = {menu:null,fire:1},
        manifest, totalLoaded, queue, matchSoundID, FireSoundID, MainSoundID, attack, pause,	viewKey,desination,desinationPath,easystar,
        PlayerFill = {fillHeart: null,fillTemp: null},
        EnemyFill = {fillHeart: null,fillTemp: null},
        map2, mapTiles, game, mapWidth, mapHeight, tileSheet, tiles, board, infoBoard, enemyInfoBoard, enemyPoint,playerPoint,
        player, playerSheet, firstKey,FireSheet, Fire, fires = [], isfire, timer, timerMax, deadCount, EnemyTemp,PlayerTemp,
        enemy, enemySheet, enemies = [], WoodSheet, Wood, woods = [],
        keysPressed = {
            38: 0,
            40: 0,
            37: 0,
            39: 0,
			32: 0,
            80: 0,
        };
    $container = document.getElementById("container");
	$infoContainer = document.getElementById("infoContainer");
    $EnemyInfoContainer = document.getElementById("EnemyInfoContainer");
    canvasW = 500;
    canvasH = 350;
    timerMax = 90;
	timer = 0;
    pause = false;
    EnemyTemp = 100;
    PlayerTemp = 150;
	deadCount = 0;
    viewKey = 1;
    map2 = [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,0,0,0,1,0,0,0,1,0],
        [0,1,0,1,0,0,1,0,1,0,1,0],
        [0,1,0,1,0,0,1,0,1,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,0,1,0,1,0,0,1,0,1,0],
        [0,1,0,1,0,1,0,0,1,0,1,0],
        [0,1,0,0,0,1,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0]
            ]
    mapTiles = {};
    
	//default function --- build the map, no need to edit it
    function buildMap(map) {
        
        var row, col, tileClone, tileIndex, defineTile;
        
        if (!board) {
            board = new createjs.Container();
            board.x = 0;
            board.y = 0;
            stage.addChild(board);
        }
        
        mapWidth = map[0].length;
        mapHeight = map.length;
        
        defineTile = {
            walkable: function (row, col) {
                if (map[row][col] === 0) {
                    return false;
                } else {
                    return true;
                }
            },
            water: function (row, col) {
                if (map[row][col] === 2) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        
        tileIndex = 0;
        mapTiles = [];
        board.removeAllChildren();
        for (row = 0; row < mapHeight; row++) {
            for (col = 0; col < mapWidth; col++) {
                tileClone = tiles.clone();
                tileClone.name = "t_" + row + "_" + col;
                tileClone.gotoAndStop(map[row][col]);
                tileClone.x = col * tileSheet._frameWidth;
                tileClone.y = row * tileSheet._frameHeight;
                mapTiles["t_" + row + "_" + col] = {
                    index: tileIndex,
                    walkable: defineTile.walkable(row, col),
                    water: defineTile.water(row, col),
					// center point of each grid
					x: tileClone.x + (tileSheet._frameWidth / 2),
					y: tileClone.y + (tileSheet._frameHeight / 2)
                };
                tileIndex++;
                board.addChild(tileClone);
            }
        } 
    }
    
	//default function --- add enemy, And I add some propoty like isfire and lifeTimer
    function addPlayer() {
        player.name = "player";
        player.x = Math.floor(canvasW / 50 / 2) * 50 + 75;
        player.y = Math.floor(canvasH / 50 / 2) * 50 + 125;
        player.regX = 0;
        player.regY = 0;
        player.speed = 6;
        player.height = 34;
        player.width = 34;
        player.gotoAndPlay("stand");
		player.lifeTimer = 0;
		player.isfire = false;
		player.fireNum = -1;
		player.temperature = PlayerTemp/2;
		//player.attack = false;
        board.addChild(player);
    }
    
	//default function --- add enemy, And I add some propoty like isfire
    function addEnemy(x, y) {
        var num = enemies.length;
        enemies[num] = enemy.clone();
        enemies[num].name = "enemy" + enemies.length;
        enemies[num].x = x * tileSheet._frameWidth + (tileSheet._frameWidth / 2);
        enemies[num].y = y * tileSheet._frameHeight + (tileSheet._frameHeight / 2);
        enemies[num].regX = 0;
        enemies[num].regY = 0;
        enemies[num].speed = 2;
        enemies[num].height = 34;
        enemies[num].width = 34;
        enemies[num].gotoAndPlay("stand");
		enemies[num].isfire = false;
		enemies[num].lifeTimer = 0;
		enemies[num].temperature = EnemyTemp/2;
		enemies[num].fireNum = -1;
		enemies[num].dead = false;		
        board.addChild(enemies[num]);
    }
	
	// Used to add the fire image
	function addFire(x,y){
        var num = fires.length;
        fires[num] = Fire.clone();
        fires[num].name = "fire" + fires.length;
        fires[num].x = x;
        fires[num].y = y;
        fires[num].regX = 0;
        fires[num].regY = 0;
        fires[num].height = 34;
        fires[num].width = 34;
        fires[num].gotoAndPlay("fire");
        board.addChild(fires[num]);
		return num;
	}
    
	function addWood(x,y){
	var num = woods.length;
        woods[num] = Wood.clone();
        woods[num].name = "wood" + woods.length;
        woods[num].x = x * tileSheet._frameWidth + (tileSheet._frameWidth / 2);
        woods[num].y = y * tileSheet._frameHeight + (tileSheet._frameHeight / 2);
        woods[num].regX = 0;
        woods[num].regY = 0;
        woods[num].height = 34;
        woods[num].width = 34;
        woods[num].gotoAndStop("idle");
		woods[num].isfire = false;
		woods[num].fireNum = -1;	
		woods[num].lifeTimer = 0;
		woods[num].destory = false;
        board.addChild(woods[num]);
		//return num;
	}
	
    function checkPosition(char)
    {
        var x,y,obj;
        x = Math.floor((char.x-board.x) / tileSheet._frameWidth);
        y = Math.floor((char.y-board.y) / tileSheet._frameHeight);
        obj = {x: x,y: y};
        return obj;
    }
    
    function checkPlayerPosition(char){
        var x,y,obj;
        x = Math.floor((char.x) / tileSheet._frameWidth);
        y = Math.floor((char.y) / tileSheet._frameHeight);
        obj = {x: x,y: y};
        return obj;
    }
    
	//default function --- check the grid is walkable or not
    function checkCorners(char, dirx, diry) {
        
        var upSide, downSide, leftSide, rightSide;
        
        if (dirx === 0) {
            leftSide = Math.floor((char.x - char.width / 2) / tileSheet._frameWidth);
            rightSide = Math.floor((char.x + char.width / 2) / tileSheet._frameWidth);
            if (diry === -1) { // up
                upSide = Math.floor(((char.y - char.width / 2) + (char.speed * diry)) / tileSheet._frameHeight);
                char.topLeft = mapTiles["t_" + upSide + "_" + leftSide];
                char.topRight = mapTiles["t_" + upSide + "_" + rightSide];
                if (char.topLeft.walkable && char.topRight.walkable) {
                    return true;
                }
            } else if (diry === 1) { // down
                downSide = Math.floor(((char.y + char.width / 2) + (char.speed * diry)) / tileSheet._frameHeight);
                char.bottomLeft = mapTiles["t_" + downSide + "_" + leftSide];
                char.bottomRight = mapTiles["t_" + downSide + "_" + rightSide];
                if (char.bottomLeft.walkable && char.bottomRight.walkable) {
                    return true;
                }
            }
        }
        if (diry === 0) {
            leftSide = Math.floor((char.y - char.height / 2) / tileSheet._frameHeight);
            rightSide = Math.floor((char.y + char.height / 2) / tileSheet._frameHeight);
            if (dirx === -1) { // left
                upSide = Math.floor(((char.x - char.width / 2) + (char.speed * dirx)) / tileSheet._frameWidth);
                char.topLeft = mapTiles["t_" + leftSide + "_" + upSide];
                char.bottomLeft = mapTiles["t_" + rightSide + "_" + upSide];
                if (char.topLeft.walkable && char.bottomLeft.walkable) {
                    return true;
                }
            } else if (dirx === 1) { // right
                downSide = Math.floor(((char.x + char.width / 2) + (char.speed * dirx)) / tileSheet._frameWidth);
                char.topRight = mapTiles["t_" + leftSide + "_" + downSide];
                char.bottomRight = mapTiles["t_" + rightSide + "_" + downSide];
                if (char.topRight.walkable && char.bottomRight.walkable) {
                    return true;
                }
            }
        }
    }

	//default functin --- move the character
    function moveChar(char, dirx, diry) {
        
        if (dirx === 0) {
            if (diry === -1 && checkCorners(char, dirx, diry)) { // up
                if (char.name === "player") {
                    board.y += -diry * char.speed;
                }
                char.y += diry * char.speed;
            } else if (diry === 1 && checkCorners(char, dirx, diry)) { // down
                if (char.name === "player") {
                    board.y += -diry * char.speed;
                }
                char.y += diry * char.speed;
            }
        }
        if (diry === 0) {
            if (dirx === -1 && checkCorners(char, dirx, diry)) { // left
                if (char.name === "player") {
                    board.x += -dirx * char.speed;
                }
                char.x += dirx * char.speed;
            } else if (dirx === 1 && checkCorners(char, dirx, diry)) { // right
                if (char.name === "player") {
                    board.x += -dirx * char.speed;
                }
                char.x += dirx * char.speed;
            }
        }
        if (board.x<=-100)
            board.x=-100;
        if (board.y<-225)
            board.y=-225;
        if (board.x>=0)
            board.x=0;
        if (board.y>25)
            board.y=25;
        //console.log("BoardX: "+board.x+" BoardY: "+board.y);
    }
    //default function --- get the distance
    function pTheorem(point1, point2) {
        return Math.floor(Math.sqrt(((point2.x - point1.x) * (point2.x - point1.x)) + ((point2.y - point1.y) * (point2.y - point1.y))));
    }
    
	//used to let enemy attack player
    function enemyBrain() {
        
        var e, distToPlayer, angleToPlayer;
        
		// function to do the fire animation
        function Fire() {
            if (enemies[e].currentAnimation !== "fire") {
                enemies[e].gotoAndPlay("fire");
            }
        }
        
        for (e = 0; e < enemies.length; e++) {
            
			enemyPoint = {x: enemies[e].x, y: enemies[e].y, speed: enemies[e].speed};
			playerPoint = {x: player.x, y: player.y};
            distToPlayer = pTheorem(enemyPoint, playerPoint);
			if (!enemies[e].dead)
			{
				if (distToPlayer >= player.width-5)
				{
					moveChar(enemies[e],WalkToX(enemyPoint,playerPoint).x,0);
					moveChar(enemies[e],0,WalkToY(enemyPoint,playerPoint).y);
					enemies[e].gotoAndStop("stand");
				}
				
				else if (distToPlayer < player.width-5) {
					Fire();
					// if player and enemy have collission, enemy will wait 1 second to fire
					if (!checkWater(player))
					{
						if (player.temperature<PlayerTemp)
							player.temperature+=2;
					}
					// if player is fired, and he will pass the fire to the enemy			
					if (!enemies[e].isfire)
					{
						//if (enemies[e].temperature>0)
						//	enemies[e].temperature--;
						if (player.isfire)
						{
							if (enemies[e].temperature<EnemyTemp)
								enemies[e].temperature += 20;
							if (enemies[e].temperature >= EnemyTemp)
							{
                                enemies[e].temperature = EnemyTemp;
								//enemies[e].fireNum = addFire(enemies[e].x,enemies[e].y);
                                //enemies[e].isfire = true;
							}
						}
					}
					
					// if player and enemy have collission, enemy will wait 2 second to fire 
					if (waitForfire())
					{
						// set the fireNum so that we know which fire is attached to the player
						if (!player.isfire)
						{
							player.fireNum = addFire(player.x,player.y);
							player.isfire = true;
						}
					}
					//console.log("wait: "+waitForfire(e));
				}
			}
        }   
    }
    
	// if player and enemy have collission, enemy will wait num second to fire 
	function waitForfire(){
			if (player.temperature >= PlayerTemp){
			return true;
		}
		return false;
	}
	//since the default moveChar can only move in one direction at one time, i write the following function to move the enemy
	//for enemy walk to x
	function WalkToX(point1,point2){
		var dir = {x:0,y:0};
		var diff_x = point1.x - point2.x;
		if (diff_x > point1.speed)
		{
			dir.x = -1;
			dir.y = 0;
		}
		else if (diff_x < -point1.speed)
		{
			dir.x = 1;
			dir.y = 0;			
		}
		else 
		{
			dir.x = 0;
			dir.y = 0;
		}

		//console.log("x: "+point1.x+" y:"+point1.y + "Player X: "+  point2.x + " Y: "+ point2.y);
		return dir;
	}
	//for enemy walk to y
	function WalkToY(point1,point2){
		var dir = {x:0,y:0};
		var diff_y = point1.y - point2.y;
		if (diff_y > point1.speed)
		{
			dir.y = -1;
			dir.x = 0;			
		}
		else if(diff_y < -point1.speed)
		{
			dir.y = 1;
			dir.x = 0;						
		}
		else
		{
			dir.x = 0;
			dir.y = 0;
		}
		return dir;
	}
	
	//used to attack enemy
	function checkAttack(){
		//if (player.attack)
		//{
            if (selectMenu.fire==1)
                player.gotoAndPlay("leftFire");
            else if (selectMenu.fire==2)
                player.gotoAndPlay("rightFire");
            //console.log("x: "+checkPosition(player).x+" y: "+checkPosition(player).y);
			for (var e = 0; e < enemies.length; e++) {
				var enemyPoint = {x: enemies[e].x, y: enemies[e].y};
				var playerPoint = {x: player.x, y: player.y};
				var distToPlayer = pTheorem(enemyPoint, playerPoint);
				if (selectMenu.fire==1)
                {
                    if(enemies[e].x<=player.x)
                    {
                        if (distToPlayer <= player.width )
                        {
                            if (!checkWater(enemies[e]))
                            {
                                if (!enemies[e].isfire)
                                {
                                    if (enemies[e].temperature < EnemyTemp)
                                        enemies[e].temperature += 5;
                                    if (enemies[e].temperature >= EnemyTemp)
                                    {
                                        enemies[e].temperature = EnemyTemp;
                                        //enemies[e].fireNum = addFire(enemies[e].x,enemies[e].y);
                                        //enemies[e].isfire = true;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (selectMenu.fire==2)
                {
                    if(enemies[e].x>=player.x)
                    {
                        if (distToPlayer <= player.width )
                        {
                            if (!checkWater(enemies[e]))
                            {
                                if (!enemies[e].isfire)
                                {
                                    if (enemies[e].temperature < EnemyTemp)
                                        enemies[e].temperature += 5;
                                    if (enemies[e].temperature >= EnemyTemp)
                                    {
                                        enemies[e].temperature = EnemyTemp;
                                        //enemies[e].fireNum = addFire(enemies[e].x,enemies[e].y);
                                        //enemies[e].isfire = true;
                                    }
                                }
                            }
                        }
                    }
                }
			}
			for (var w = 0; w < woods.length; w++) {
				var woodPoint = {x: woods[w].x, y: woods[w].y};
				var playerPoint = {x: player.x, y: player.y};
				var distToPlayer = pTheorem(woodPoint, playerPoint);
				
				if (distToPlayer < player.width )
				{
					if (!woods[w].isfire)
					{
						woods[w].fireNum = addFire(woods[w].x,woods[w].y);
						woods[w].isfire = true;
					}
				}
			}   			
		//}
	}
	
	//spread the fire from wood to character
	function checkWoodFire(){
		var w, e, distToPlayer, distToEnemy, enemyPoint, playerPoint, woodPoint;
        for (w = 0; w < woods.length; w++) {
			if (!woods[w].destory)
			{
				woodPoint = {x: woods[w].x, y: woods[w].y};
				for (e = 0; e < enemies.length; e++) {
					enemyPoint = {x: enemies[e].x, y: enemies[e].y};
					distToEnemy = pTheorem(woodPoint, enemyPoint);
					if (distToEnemy < enemies[e].width/2){
						if (woods[w].isfire){
							if (!enemies[e].isfire){
                                    enemies[e].temperature +=5;
                            }
                            if (enemies[e].temperature >=EnemyTemp){
								enemies[e].temperature = EnemyTemp;
							}
						}
						else if (enemies[e].isfire){
								woods[w].fireNum = addFire(woods[w].x,woods[w].y);
								woods[w].isfire = true;
							}	
					}
				}
				
				playerPoint = {x: player.x, y: player.y};
				distToPlayer = pTheorem(woodPoint, playerPoint);
				if (distToPlayer < player.width/2){
					if (woods[w].isfire){
						if (!player.isfire){
                            player.temperature +=5;
                        }
                        if (player.temperature >=PlayerTemp){ 
							player.temperature = PlayerTemp;
						}
					}
					else if (player.isfire){
							woods[w].fireNum = addFire(woods[w].x,woods[w].y);
							woods[w].isfire = true;
						}
				}
			}
		}
	}
	
    document.addEventListener("keydown", function (e) {
        keysPressed[e.keyCode] = 1;
		if (e.keyCode === 32) attack = true;
        if (e.keyCode === 80) Pause();
        if (e.keyCode >= 49 && e.keyCode <= 57) viewKey = (e.keyCode-48);
        if (!firstKey) { firstKey = e.keyCode; }
    });
    document.addEventListener("keyup", function (e) {
        keysPressed[e.keyCode] = 0;
        if (firstKey === e.keyCode) { firstKey = null; }
        if (player) { player.gotoAndStop("stand"); }
    });
	
	//default function --- check key event and move the character, i will add the spacebar event here so player can attack 
    function detectKeys() {
        
        if (keysPressed[38] === 1) { // up
            moveChar(player, 0, -1);
        }
        if (keysPressed[40] === 1) { // down
            moveChar(player, 0, 1);
        }
        if (keysPressed[37] === 1) { // left
            moveChar(player, -1, 0);
        }
        if (keysPressed[39] === 1) { // right
            moveChar(player, 1, 0);
        }
        if (keysPressed[32] === 1) { // attack
			if(attack){
				checkAttack();
				attack = false;
				if(!matchSoundID){
				    matchSound();
				}
			}		
        }
    }
	
	// Add Mouse Click event here
	function MouseEvent(){
    stage.canvas.addEventListener("wheel", function(e) {
        checkAttack();
        if(!matchSoundID){
            matchSound();
        }
	   //console.log(e);
    });
	stage.on("stagemousedown", function(evt) {
        var obj = {x:evt.stageX,y:evt.stageY};
        if(!pause){
            switch (btnCode) {
            case 0:
                //console.log('Left button clicked.');
                if(!desinationPath){
                    moveToDestination(checkPosition(obj));
                }
                else if (desinationPath.x!=obj.x || desinationPath.y!=obj.y){
                    moveToDestination(checkPosition(obj));
                    //console.log("destination change");
                }
            break;

            case 1:
                console.log('Middle button clicked.');
            break;

            case 2:
                Pause();
                console.log('Right button clicked.');
            break;

            default:
                console.log('Unexpected code: ' + btnCode);
            }            
        }
        else {
            if (btnCode==0){
                var x= evt.stageX;
                var y = evt.stageY;
                if (x<=canvasW/2){
                    lhandIcon.alpha = 1;
                    rhandIcon.alpha = 0.7;
                    selectMenu.fire = 1;
                }
                else if (x>canvasW/2){
                    lhandIcon.alpha = 0.7;
                    rhandIcon.alpha = 1;
                    selectMenu.fire = 2;
                }
            }
            if (btnCode==2)
                Pause();
        }
	});
	
	stage.on("stagemouseup", function(evt) {
        if (player) { player.gotoAndStop("stand"); }
	});
	}
	
    //create pathfinding
    function createPath(){
        easystar = new EasyStar.js();
        easystar.setGrid(map2);
        easystar.setAcceptableTiles([1]);
    }
    
    // move to destination using pathfinding: easystar
    function moveToDestination(obj){
        if (mapTiles["t_" + obj.y + "_" + obj.x].walkable){
            createPath();
            var x = checkPlayerPosition(player).x;
            var y = checkPlayerPosition(player).y;
            easystar.findPath(x, y, obj.x, obj.y, function( path ) {
                if (path === null) {
                    console.log("Path was not found.");
                } else {

                    var movement = createjs.Tween.get(player,{override:true}).to({x: player.x, y: player.y },0);
                    //if (character==player)
                    var BoardMovement = createjs.Tween.get(board,{override:true}).to({x: board.x, y: board.y },0);
                    console.log("x:"+x+" y: "+y);
                    if (path.length>1)
                        desinationPath = {x:path[path.length-1].x, y:path[path.length-1].y};
                    for (var i=1;i<path.length;i++){
                        var X = path[i].x*tileSheet._frameWidth+tileSheet._frameWidth/2;
                        var Y = path[i].y*tileSheet._frameHeight+tileSheet._frameHeight/2;
                        var bX = (path[i].x-path[i-1].x)*tileSheet._frameWidth;
                        var bY = (path[i].y-path[i-1].y)*tileSheet._frameHeight;
                        console.log("Path was found. The first Point is " + X + " " + Y);
                        console.log(bX+" by: "+bY);
                        movement.to({x: X, y: Y },150).call(function(){
                            console.log("player x: "+player.x+" X: "+X+" y: "+player.y+" Y: "+Y);
                        });
                        //if (character==player){
                            //restrict the camera
                            if (X<canvasW/2){
                                if (Y<canvasH/2)
                                    BoardMovement.to({x: 0, y: 25 },250);
                                else if (Y>canvasH/2)
                                    BoardMovement.to({x: 0, y: (-Y+canvasH/2) },250);
                                //else if (500-Y<canvas/2)
                            }
                            else if (X>canvasW/2){
                                if (Y<canvasH/2)
                                    BoardMovement.to({x: (-X+canvasW/2), y: 25 },250);
                                else if (Y>canvasH/2)
                                    BoardMovement.to({x: (-X+canvasW/2), y: (-Y+canvasH/2) },250);
                            }
                            else if ((800-X)<canvasW/2){
                                if (Y<canvasH/2)
                                    BoardMovement.to({x: (-800+canvasW), y: 25 },250);
                                else if (Y>canvasH/2)
                                    BoardMovement.to({x: (-800+canvasW), y: (-Y+canvasH/2) },250);
                            }
                            else if ((800-X)>canvasW/2){
                                if (Y<canvasH/2)
                                    BoardMovement.to({x: (-X+canvasW/2), y: 25 },250);
                                else if (Y>canvasH/2)
                                    BoardMovement.to({x: (-X+canvasW/2), y: (-Y+canvasH/2) },250);
                           // }
                        }
                        
                    }
                }
            });
            easystar.calculate();
        }
    }
    
	// create match Sound
	function matchSound(){
		matchSoundID = createjs.Sound.play("match_sound");
		matchSoundID.on("complete", function(event){matchSoundID=null;player.gotoAndStop(0)});
	}
	
    // play fire sound
	function FireSound(){
		FireSoundID = createjs.Sound.play("fire_sound");
		FireSoundID.on("complete", function(event){FireSoundID=null;});
	}
	
    //play main bgm
    function MainSound(){
        MainSoundID = createjs.Sound.play("main");
        //MainSoundID.volume = 0.5;
		MainSoundID.on("complete", function(event){MainSoundID=null;});
    }
    
    //check fire and if is fire, play sound effect
    function onFire(){
        if(checkFire()){
			if(!FireSoundID){
				FireSound();
				//console.log("Play Fire");
			}
			//console.log("Check Fire");
		}
    }
    
	// This function is used to update the fire position and attach to player and enemy
	function checkFire(){
		
		//used to check whether should play the fire sound effect or not
		var isfire = false;
		//check fire on player
		if (player.isfire)
		{
			if (checkWater(player))
			{
				isfire = false;
			}
			else
			{
				isfire = true;
				fires[player.fireNum].x = player.x;
				fires[player.fireNum].y = player.y;
				player.lifeTimer++;
			}
			// timerMax = 30 frames = 1s
			if (player.lifeTimer>(timerMax*4))
			{
				alert("You are dead!");
				player.lifeTimer = 0;
				location.reload();
			}
		}
		// else
			// player.lifeTimer = 0;
		
		//check fire on enemy
		for (var e = 0; e < enemies.length; e++) {
			if (!enemies[e].dead)
			{
				if (enemies[e].isfire)
				{
					if (checkWater(enemies[e]))
					{
						isfire = false;
					}
					else
					{
						isfire = true;
						fires[enemies[e].fireNum].x = enemies[e].x;
						fires[enemies[e].fireNum].y = enemies[e].y;
						enemies[e].lifeTimer++;
					}
					if (enemies[e].lifeTimer>timerMax*2)
					{
						board.removeChild(fires[enemies[e].fireNum]);
						board.removeChild(enemies[e]);
						enemies[e].dead = true;
						//enemies[e].isfire = false;
						deadCount++;
						//console.log("DeadCount: "+deadCount);
					}
				}
			}
		}
		
		if (deadCount == enemies.length)
		{
			alert("You win!");
			//console.log(enemies.length);
			//deadCount = 0;
            stage.removeAllChildren();
            stage.removeAllEventListeners();
            startGame3();
		}
		
		//check fire on wood
		for (var w = 0; w < woods.length; w++) {
			if (!woods[w].destory){
				if (woods[w].isfire){
					isfire = true;
					woods[w].lifeTimer++;
					if (woods[w].lifeTimer>timerMax*3)
					{
						board.removeChild(fires[woods[w].fireNum]);
						board.removeChild(woods[w]);
						woods[w].destory = true;
					}
				}
			}
		}
		
		return isfire;
	}
    
    //check char is on water or not
    function checkWater(Character){
        var x , y;
        x = checkPlayerPosition(Character).x;
        y = checkPlayerPosition(Character).y;
        if (mapTiles["t_" + y + "_" + x].water){
            var waterPoint = {x: mapTiles["t_" + y + "_" + x].x, y: mapTiles["t_" + y + "_" + x].y};
            var CharPoint = {x: Character.x, y: Character.y};
            var distToChar = pTheorem(waterPoint, CharPoint);
			if (distToChar <= Character.width )
			{
					if (Character === player)	
					{
						if (Character.temperature>0)
						{
							Character.temperature--;
							//console.log("player recover");
						}
					}
					else
						if (Character.temperature>0)
							Character.temperature--;
					Character.isfire = false;
					board.removeChild(fires[Character.fireNum]);
					//console.log("clear");
					return true;
            }
        }
        //console.log("not clear");
        return false;
    }
    
    //update temperature
    function updateTemperature(){
        checkWater(player);
        if (!checkWater(player)){
            if (!player.isfire){
                if (player.temperature>=PlayerTemp){
                    player.fireNum = addFire(player.x,player.y);
                    player.isfire = true;
                }
                else if (player.temperature<PlayerTemp/2){
                    player.temperature++;
                }
                else if (player.temperature>PlayerTemp/2){
                    player.temperature--;
                }
            }
        }
        for (var e =0;e<enemies.length;e++){
            checkWater(enemies[e]);
            if (!checkWater(enemies[e])){
                if (!enemies[e].dead){
                    if (!enemies[e].isfire){
                        if (enemies[e].temperature>=EnemyTemp){
                            enemies[e].fireNum = addFire(enemies[e].x,enemies[e].y);
                            //console.log("num "+e+": temp :"+enemies[e].temperature);
                            enemies[e].isfire = true;
                        }
                        else if (enemies[e].temperature<EnemyTemp/2){
                            enemies[e].temperature++;
                        }
                        else if (enemies[e].temperature>EnemyTemp/2){
                            enemies[e].temperature--;
                        }
                    }
                }
            }
        }
    }
	
    //check num of enemies alive
    function checkAliveEnemy(index){
        if (index<enemies.length)
            if (!enemies[index-1].dead)
                return (index);
        for (var e =0;e<enemies.length;e++){
            if (!enemies[e].dead){
                return (e+1);
            }
        }
        return false;
    }
    
	// default function --- time ticker, keep updating every frame, you can do something that need to update in here
    function handleTick() {
        if (deadCount<3){
            if (!pause){
                detectKeys();
                enemyBrain();
                checkWoodFire();
                onFire();
                updateTemperature();
                updateInfo();
            }
            else{
                for (var i=0; i<enemies.length;i++){
                    enemies[i].gotoAndStop(0);
                }
            }
            stage.update();
        }
	}
    
    //pause game
    function Pause(){
        pause = !pause;
        if (pause){
            player.gotoAndStop(0);
            for (var i=0; i<enemies.length;i++){
                enemies[i].gotoAndStop(0);
            }
            for (var i=0; i<fires.length;i++){
                fires[i].gotoAndStop(0);
            }
            if (FireSoundID)
                FireSoundID.stop();
            if (!selectMenu.menu)
                SelectMenu();
            else updateSelectMenu();
        }
        else {
            for (var i=0; i<fires.length;i++){
                fires[i].gotoAndPlay("fire");
            }
            if (FireSoundID)
                FireSoundID.play();
            updateSelectMenu();
        }
    }
    
	//Info Canvas
	function InfoBar(){
		infoCanvas = document.getElementById("info");
        infoStage = new createjs.Stage(infoCanvas);
        infoStage.enableMouseOver(30);
		infoStage.enableDOMEvents(true);
        createjs.Touch.enable(infoStage);
        createjs.Ticker.addEventListener("tick", infoStage);
		
		if (!infoBoard) {
            infoBoard = new createjs.Container();
            infoBoard.x = 0;
            infoBoard.y = 0;
            infoStage.addChild(infoBoard);
        }
	}
    
    //EnemyInfo Canvas
	function EnemyInfoBar(){
		enemyInfoCanvas = document.getElementById("enemyInfo");
        enemyInfoStage = new createjs.Stage(enemyInfoCanvas);
        enemyInfoStage.enableMouseOver(30);
		enemyInfoStage.enableDOMEvents(true);
        createjs.Touch.enable(enemyInfoStage);
        createjs.Ticker.addEventListener("tick", enemyInfoStage);
		
		if (!enemyInfoBoard) {
            enemyInfoBoard = new createjs.Container();
            enemyInfoBoard.x = 0;
            enemyInfoBoard.y = 0;
            enemyInfoStage.addChild(enemyInfoBoard);
        }
	}
    
    //update Info
    function updateInfo(){
        updateInfoBar(1/(timerMax*4)*(timerMax*4-player.lifeTimer),PlayerFill.fillHeart,"fillHeart");
        updateInfoBar(1/PlayerTemp*player.temperature,PlayerFill.fillTemp,"fillTemp");
        var e = checkAliveEnemy(viewKey);
        EnemyText.text = "Enemy "+(e)+" :"
        //console.log("e: "+e+" key: "+viewKey);
        if (enemies.length>0){
            if (e){
                if (e===viewKey){
                    updateInfoBar(1/(timerMax*2)*(timerMax*2-enemies[e-1].lifeTimer),EnemyFill.fillHeart,"fillHeart");
                    updateInfoBar(1/EnemyTemp*enemies[e-1].temperature,EnemyFill.fillTemp,"fillTemp");
                }
                else {
                        updateInfoBar(1/(timerMax*2)*(timerMax*2-enemies[e-1].lifeTimer),EnemyFill.fillHeart,"fillHeart");
                        updateInfoBar(1/EnemyTemp*enemies[e-1].temperature,EnemyFill.fillTemp,"fillTemp");
                }
            }
        }
    }
    
	//create Text
	function CreateText(){
		PlayerText = new createjs.Text("Player: ", "20px Arial", "#ff7700");
		PlayerText.x = 50;
		PlayerText.y = 50;
		PlayerText.textBaseline = "alphabetic";
		infoBoard.addChild(PlayerText);
        EnemyText = new createjs.Text("Enemy: ", "20px Arial", "#000000");
		EnemyText.x = 50;
		EnemyText.y = 50;
		EnemyText.textBaseline = "alphabetic";
		enemyInfoBoard.addChild(EnemyText);
	}
    
    //update Select menu
    function updateSelectMenu(){
        if (pause){
            selectMenu.menu.x = -board.x+canvasW/2;
            selectMenu.menu.y = -board.y+canvasH/2;
            bodyIcon.x = selectMenu.menu.x-139;
            bodyIcon.y = selectMenu.menu.y-155;
            headIcon.x = selectMenu.menu.x-85;
            headIcon.y = selectMenu.menu.y-100;
            lhandIcon.x = selectMenu.menu.x-75;
            lhandIcon.y = selectMenu.menu.y-75;
            rhandIcon.x = selectMenu.menu.x-85;
            rhandIcon.y = selectMenu.menu.y-75;
            llegIcon.x = selectMenu.menu.x-215;
            llegIcon.y = selectMenu.menu.y-20;
            rlegIcon.x = selectMenu.menu.x-175;
            rlegIcon.y = selectMenu.menu.y-10;
            selectMenu.menu.alpha = 0.7;
            bodyIcon.alpha = 0.7;
            headIcon.alpha = 0.7;
            lhandIcon.alpha = 0.7;
            rhandIcon.alpha = 0.7;
            llegIcon.alpha = 0.7;
            rlegIcon.alpha = 0.7;
        }
        else{
            selectMenu.menu.alpha = 0;
            bodyIcon.alpha = 0;
            headIcon.alpha = 0;
            lhandIcon.alpha = 0;
            rhandIcon.alpha = 0;
            llegIcon.alpha = 0;
            rlegIcon.alpha = 0;
        }
    }
    
    //create Select menu
    function SelectMenu(){
        var x = -board.x;
        var y = -board.y;
        selectMenu.menu = new createjs.Shape().set({x:(x+canvasW/2), y:(y+canvasH/2), scaleX:1});
        selectMenu.menu.graphics.beginFill("white").drawRoundRect(-125,-100,300,200,6);
        selectMenu.menu.alpha = 0.7;
        board.addChild(selectMenu.menu);
        bodyIcon.x = selectMenu.menu.x-139;
        bodyIcon.y = selectMenu.menu.y-155;
        board.addChild(bodyIcon);
        headIcon.x = selectMenu.menu.x-85;
        headIcon.y = selectMenu.menu.y-100;
        board.addChild(headIcon);
        lhandIcon.x = selectMenu.menu.x-75;
        lhandIcon.y = selectMenu.menu.y-75;
        board.addChild(lhandIcon);
        rhandIcon.x = selectMenu.menu.x-85;
        rhandIcon.y = selectMenu.menu.y-75;
        board.addChild(rhandIcon);
        llegIcon.x = selectMenu.menu.x-215;
        llegIcon.y = selectMenu.menu.y-20;
        board.addChild(llegIcon);
        rlegIcon.x = selectMenu.menu.x-175;
        rlegIcon.y = selectMenu.menu.y-10;
        board.addChild(rlegIcon);
        bodyIcon.alpha = 0.7;
        headIcon.alpha = 0.7;
        lhandIcon.alpha = 0.7;
        rhandIcon.alpha = 0.7;
        llegIcon.alpha = 0.7;
        rlegIcon.alpha = 0.7;
    }
    
    //create Info Bar
    function CreateInfoBar(icon,iconX,iconY,barX,barY,color,fill,fillName){
        // Create a shape
        var bar = new createjs.Shape().set({x:barX, y:barY}); // Move away from the top left
        infoBoard.addChild(bar);
        var icon = new createjs.Bitmap(icon);
        icon.x = iconX;
        icon.y = iconY;
        // Draw the outline
        bar.graphics.setStrokeStyle(2)
            .beginStroke("black")
            .drawRoundRect(-1,-1,204,32,7)
            .endStroke();
        // Draw the fill. Only set the style here
        fill[fillName] = new createjs.Shape().set({x:barX, y:barY, scaleX:0});
        fill[fillName].graphics.beginFill(color).drawRoundRect(0,0,202,30,6);
        infoBoard.addChild(fill[fillName]);
        infoBoard.addChild(icon);
        
        //special case : adding one more icon for temperature
        if(fillName==="fillTemp")
        {
            var icon = new createjs.Bitmap(fireIcon);
            icon.x = (barX+185);
            icon.y = iconY-5;
            infoBoard.addChild(icon);
        }
        // Tween the bar's width to 100.
        createjs.Tween.get(fill[fillName]).to({scaleX:1}, 0, createjs.Ease.quadIn);
    }
    
    //create Enemy Info Bar
    function CreateEnemyInfoBar(icon,iconX,iconY,barX,barY,color,fill,fillName){
        // Create a shape
        var bar = new createjs.Shape().set({x:barX, y:barY}); // Move away from the top left
        enemyInfoBoard.addChild(bar);
        var icon = new createjs.Bitmap(icon);
        icon.x = iconX;
        icon.y = iconY;
        // Draw the outline
        bar.graphics.setStrokeStyle(2)
            .beginStroke("black")
            .drawRoundRect(-1,-1,204,32,7)
            .endStroke();
        // Draw the fill. Only set the style here
        fill[fillName] = new createjs.Shape().set({x:barX, y:barY, scaleX:0});
        fill[fillName].graphics.beginFill(color).drawRoundRect(0,0,202,30,6);
        enemyInfoBoard.addChild(fill[fillName]);
        enemyInfoBoard.addChild(icon);
        
        //special case : adding one more icon for temperature
        if(fillName==="fillTemp")
        {
            var icon = new createjs.Bitmap(fireIcon);
            icon.x = (barX+185);
            icon.y = iconY-5;
            enemyInfoBoard.addChild(icon);
        }
        // Tween the bar's width to 100.
        createjs.Tween.get(fill[fillName]).to({scaleX:0.5}, 0, createjs.Ease.quadIn);
    }
    
    //update value of InfoBar
    function updateInfoBar(fraction,fill,fillName){
        if(fillName==="fillTemp"){
            var color = ["#0000A0","#ADD8E6","#FFA500","#ff0000","#A52A2A"];
            if (fraction<=0.2){
                fill.graphics.beginFill(color[0]).drawRoundRect(0,0,202,30,6);
            }
            else if (fraction<=0.4){
                fill.graphics.beginFill(color[1]).drawRoundRect(0,0,202,30,6);
            }
            else if (fraction<=0.6){
                fill.graphics.beginFill(color[2]).drawRoundRect(0,0,202,30,6);
            }
            else if (fraction<=0.8){
                fill.graphics.beginFill(color[3]).drawRoundRect(0,0,202,30,6);
            }
            else if (fraction<=1){
                fill.graphics.beginFill(color[4]).drawRoundRect(0,0,202,30,6);
            }
            
        }
        //console.log(fill+":"+fraction);   
        createjs.Tween.get(fill).to({scaleX:fraction}, 0, createjs.Ease.quadIn);
    }
    
	//create spiriteSheet
	function CreateSpirite(){
		        // animation frames are not required
        tileSheet = new createjs.SpriteSheet({
            images: ["images/map.png"],
            frames: {
                height: 50,
                width: 50,
                regX: 0,
                regY: 0,
                count: 3
            }
        });
        
        tiles = new createjs.Sprite(tileSheet);
        
        playerSheet = new createjs.SpriteSheet({
            animations: {
                stand: [0],
                rightFire: [1,3],
                leftFire: [5, 7]
            },
            images: ["images/fm_both.png"],
            frames: {
                height: 50,
                width: 50,
                regX: 25,
                regY: 25,
                count: 8
            }
        });
        
        player = new createjs.Sprite(playerSheet);
        
        enemySheet = new createjs.SpriteSheet({
            animations: {
                stand: [0],
                fire: [1, 3],
            },
            images: ["images/fm_fire_both.png"],
            frames: {
                height: 50,
                width: 50,
                regX: 25,
                regY: 25,
                count: 4,
            }
        });
        
        enemy = new createjs.Sprite(enemySheet);
		
		FireSheet = new createjs.SpriteSheet({
            animations: {
                idle: [0],
                fire: [0, 4]
            },
            images: ["images/fire.png"],
            frames: {
                height: 38,
                width: 38,
                regX: 19,
                regY: 19,
                count: 10,
            }
        });
        
        Fire = new createjs.Sprite(FireSheet);
		
		WoodSheet = new createjs.SpriteSheet({
            animations: {
                idle: [0],
            },
            images: ["images/tile_wood.png"],
            frames: {
                height: 32,
                width: 32,
                regX: 16,
                regY: 16,
                count: 1
            }
        });
        
        Wood = new createjs.Sprite(WoodSheet);
	}
	
    function init() {
        
		// Main Game Canvas
        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(30);
		stage.enableDOMEvents(true);
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(30);
        createjs.Ticker.useRAF = true;
        createjs.Ticker.addEventListener("tick", handleTick);
        MouseEvent();
		
		// Info Canvas
		InfoBar();
        var value = 40;
        
        //create the player health and temperature bar
        CreateInfoBar(heartIcon,15+value,35+value/2,50+value,50+value/2,"#ff0000",PlayerFill,"fillHeart");
        CreateInfoBar(tempIcon,250+value,30+value/2,290+value,50+value/2,"blue",PlayerFill,"fillTemp");
        
        // Enemy Info Canvas
        EnemyInfoBar();
        
        //create the enemy health and temperature bar
        CreateEnemyInfoBar(heartIcon,15+value,35+value/2,50+value,50+value/2,"#ff0000",EnemyFill,"fillHeart");
        CreateEnemyInfoBar(tempIcon,250+value,30+value/2,290+value,50+value/2,"orange",EnemyFill,"fillTemp");
                
		//Create Info Text
		CreateText();
        
		//create spiriteSheet
		CreateSpirite();

        //play bgm music
        MainSound();
    }
    // default function --- initialization and build the map, add the player and enemy
	init();
    stage.currentMap = "map2";
    buildMap(map2);
    for (var row = 0; row < mapHeight; row+=5) {
        for (var col = 0; col < mapWidth; col+=2) {
			if (mapTiles["t_" + row + "_" + col].walkable)
				addWood(col,row);
		}
	}
	addPlayer();
	addEnemy(10, 5);
	addEnemy(1, 1);
	addEnemy(6, 4);
};