var queue,heartIcon,tempIcon,fireIcon;

function Menu(){
	
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
			{src: "sounds/fire.mp3", id: "fire_sound"},
			{src: "sounds/match.mp3", id: "match_sound"},			
			{src: "images/main2.png", id: "menu"},
			{src: "images/new_game.png", id: "start"},
			{src: "images/continue.png", id: "continue"},
			{src: "images/multi_icon.png", id: "multi"},
            {src: "images/heart.png", id:"heart"},
            {src: "images/temp.png", id:"temp"},
            {src: "images/fire_icon.png", id:"fireIcon"}
        ];
        totalLoaded = 0;
        
        function handleLoadComplete(event) {
            totalLoaded++;
           if (totalLoaded == manifest.length) {
              addTitleView();
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
			//Create new Bitmap after preloading the image
			var myMenu = new createjs.Bitmap(menu);
			var myStart = new createjs.Bitmap(startBtn);
			var myContinue = new createjs.Bitmap(continueBtn);
			var myMulti = new createjs.Bitmap(multiBtn);
			var object = [myStart,myContinue,myMulti];
			//--------------------------------------------------------
			addTitleView(myMenu,object);
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
		object[0].addEventListener("click", newGame);
}

function newGame(){
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	startGame();
	bgmID.stop();
}

function matchSound(){
	var id = createjs.Sound.play("match_sound");
	return id;
}
}