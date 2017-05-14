var queue,heartIcon,tempIcon,fireIcon,headIcon,bodyIcon,lhandIcon,rhandIcon,llegIcon,rlegIcon,level,people;
/*var person = prompt("Please enter your name", "Tom"+(Math.floor(Math.random()*100+1)));
if (person != null) {
    people = person;
}*/

function Menu(count){
	
	var $container, canvas, stage,board, menu, startBtn, continueBtn, multiBtn, btmID;
	$container = document.getElementById("container");
    canvasW = 480;
    canvasH = 320;
	canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);

	if (!board) {
		board = new createjs.Container();
		board.x = 0;
		board.y = 0;
		stage.addChild(board);
	}
	
	manifest = [
            {src: "sounds/bgm.mp3", id: "bgm"},
            {src: "sounds/main.mp3", id: "main"},
			{src: "sounds/fire.mp3", id: "fire_sound"},
			{src: "sounds/match.mp3", id: "match_sound"},			
			{src: "images/main2.png", id: "menu"},
			{src: "images/new_game.png", id: "start"},
			{src: "images/continue.png", id: "continue"},
			{src: "images/multi_icon.png", id: "multi"},
            {src: "images/heart.png", id:"heart"},
            {src: "images/temp.png", id:"temp"},
            {src: "images/fire_icon.png", id:"fireIcon"},
            {src: "images/head.png", id:"head"},
            {src: "images/body.png", id:"body"},
            {src: "images/lhand.png", id:"lhand"},
            {src: "images/rhand.png", id:"rhand"},
            {src: "images/lleg.png", id:"lleg"},
            {src: "images/rleg.png", id:"rleg"},
            {src: "images/storyboard1_1.png", id:"1_1"},
            {src: "images/storyboard1_2.png", id:"1_2"},
            {src: "images/storyboard1_3.png", id:"1_3"},
            {src: "images/tut.png", id:"tut"}
        ];
        totalLoaded = 0;
        
        function handleLoadComplete(event) {
            totalLoaded++;
           if (totalLoaded == manifest.length) {
              //addTitleView();
           }
        }
        
        function handleFileLoad(event) {
            var img, audio;
            if (event.item.type === "image") {
                img = new Image();
                img.src = event.item.src;
                img.onload = handleLoadComplete;
            } else if (event.item.type === "sound") {
                audio = new Audio();
                audio.src = event.item.src;
                audio.onload = handleLoadComplete;
            }
        }
        
        function handleComplete(event) {
			//Play the backgound music
			bgmID = createjs.Sound.play("bgm");
			//Preload the image and get the result
			menu = queue.getResult("menu");
			startBtn = queue.getResult("start");
			continueBtn = queue.getResult("continue");
			multiBtn = queue.getResult("multi");
            heartIcon = queue.getResult("heart");
            tempIcon = queue.getResult("temp");
            fireIcon = queue.getResult("fireIcon");
            headIcon = new createjs.Bitmap(queue.getResult("head"));
            bodyIcon = new createjs.Bitmap(queue.getResult("body"));
            lhandIcon = new createjs.Bitmap(queue.getResult("lhand"));
            rhandIcon = new createjs.Bitmap(queue.getResult("rhand"));
            llegIcon = new createjs.Bitmap(queue.getResult("lleg"));
            rlegIcon = new createjs.Bitmap(queue.getResult("rleg"));
			//Create new Bitmap after preloading the image
			var myMenu = new createjs.Bitmap(menu);
			var myStart = new createjs.Bitmap(startBtn);
			var myContinue = new createjs.Bitmap(continueBtn);
			var myMulti = new createjs.Bitmap(multiBtn);
			var object = [myStart,myContinue,myMulti];
			//--------------------------------------------------------
            if (count!="ending")
                addTitleView(myMenu,object);
            else
            {
                stage.removeAllChildren();
                var sb = new Storyboard();
                sb.init({stage: stage});
                sb.startDialog({plot: "opening", num: 0});
            }
			//console.log(menu);
        }
        
        queue = new createjs.LoadQueue();
		queue.installPlugin(createjs.Sound);
		//queue = createjs.Sound.alternateExtensions = ["mp3"];
        queue.addEventListener("fileload", handleFileLoad);
        queue.addEventListener("complete", handleComplete);
        queue.loadManifest(manifest);
        createjs.Ticker.addEventListener("tick", stage);
        
function addTitleView(menu, object){
		// Add menu first so it will in the bottom
		board.addChild(menu);
	for (var i = 0; i<object.length;i++){
		// Add to View
		object[i].alpha = 0.7;
		object[i].x = canvasW/3;
		object[i].y = canvasH/2 + i *50;
		object[i].scaleX = object[i].scaleY = 0.25;
		board.addChild(object[i]);
		// Button Listeners
		object[i].addEventListener("mouseover", function (event){event.target.alpha = 1;});
		object[i].addEventListener("mouseout", function (event){event.target.alpha = 0.7;});
	}
		stage.addChild(board);
		// Button Listeners
		object[0].addEventListener("click", story);
        object[1].addEventListener("click", resume);
}
    
    function resume(){
        if (level==1)
            startGame();
        else if (level==2)
            startGame2();
        else if (level ==3)
            startGame3();       
    }

    
function Storyboard() {
	this.story ={
		"opening": [
			{
				foreground: "images/storyboard1_1.png",
				chara: "",
				text: "so sad It is the world's fault"
			},
			{
				foreground: "images/storyboard1_2.png",
				chara: "",
				text: "you should give more time"
			},
			{
				foreground: "images/storyboard1_3.png",
				chara: "",
				text: "so that I can save her life"
			},
            {
                foreground: "images/tut.png",
				chara: "",
				text: "Instuction"
            }
		],
        "ending": [
			{
				foreground: "images/storyboard1_1.png",
				chara: "",
				text: "so sad It is the world's fault"
			},
			{
				foreground: "images/storyboard1_2.png",
				chara: "",
				text: "you should treasure more time"
			},
			{
				foreground: "images/storyboard1_3.png",
				chara: "",
				text: "to accompany with her"
			}
		]
	}
	this.init = function({stage}){
		this.currentDialog = 0;
		this.currentPlot = null;
		this.moviePlayed = false;
		this.playingPlot = false;
		
		this.video = document.createElement("video");
		this.video.setAttribute("width",320);
		this.video.setAttribute("height",240);
		this.video.setAttribute("autoplay",true);
		this.src = document.createElement("source");
		this.src.setAttribute("src","images/anim_02.mp4");
		this.src.setAttribute("type","video/mp4");
		this.video.appendChild(this.src);
		
		this.img = document.createElement("img");
		
		this.stage = stage;
		this.board = new createjs.Bitmap();
		//this.board = new createjs.Bitmap(this.video)
		//	.set({/*x:stage.canvas.width/2, y: stage.canvas.height/2, regX:320/2, regY:240/2,*/ scaleX:320/800, scaleY:240/600});
		this.stage.addChild(this.board);
		
		this.text = new createjs.Text("", "16px Arial", "#ff7700")
			.set({x:20, y:this.stage.canvas.height-50});
		this.stage.addChild(this.text);
		
		this.video.addEventListener("ended", e => {
			this.movEnd();
		});
		
		this.setCurrPlot();
		
		this.stage.addEventListener("click", e => {
			if (this.playingPlot){
				if (!this.moviePlayed){
					this.video.paused ? this.video.play() : this.video.pause();
					this.movEnd();
					return;
				} 
				this.nextDialog();
				
			}
		})
		
	}
	this.setCurrPlot = function (plot = "opening"){
		this.currentPlot = this.story[plot];
	}
	this.setCurrDial = function (num = 0){
		this.currentDialog = num;
	}
	
	this.nextDialog = function(){
		if (this.currentDialog < this.currentPlot.length) {
			this.text.text = this.currentPlot[this.currentDialog].text;
			this.img.setAttribute("src",this.currentPlot[this.currentDialog].foreground);
			this.currentDialog++;
		} else {
            if (count=="opening")
                newGame();
            else if (count=="ending")
				location.reload();
			this.endDialog();
		}
	}
	this.endDialog = function(){
		this.text.text = "";
		this.text.visible = false;
		this.img.setAttribute("src","");
		this.board.visible = false;
		this.playingPlot = false;
	}
	this.startDialog = function({plot, num}){
		this.board.image = this.img;
		this.board.set({x:this.stage.canvas.width/2, y:this.stage.canvas.height/2, regX: 375/2, regY: 200/2, scaleX: 1, scaleY: 1});
		this.setCurrPlot(plot);
		this.setCurrDial(num);
		this.text.visible = true;
		this.board.visible = true;
		this.playingPlot = true;
		this.nextDialog();
	}
	
	this.startOpMov = function () {
		this.moviePlayed = false;
		this.board.image = this.video;
		this.board.set({x:0, y: 0, regX:0, regY:0, scaleX:320/800, scaleY:240/600});	
		this.video.load();
		this.playingPlot = true;
	}
	
	this.movEnd = function() {
		this.startDialog({plot: "opening", num: 0});
		this.moviePlayed = true;
	}
}    

function story(){
    stage.removeAllChildren();
    var sb = new Storyboard();
    sb.init({stage: stage});
    sb.startDialog({plot: "opening", num: 0});
}
function newGame(){
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	startGame();
	bgmID.stop();
}
    
function newGame2(){
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	startGame2();
	bgmID.stop();
}

function matchSound(){
	var id = createjs.Sound.play("match_sound");
	return id;
}
}