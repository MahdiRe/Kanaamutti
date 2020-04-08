
// Game piece variable declaration
var myGamePiece, myObstacles, myScore, myHealth;

// Game logic varialble declaration
var i, height, minGap, maxGap, obstacleTypes, numberOfLanes, x, y, randomObstacle, wait=1;

function init() {
    // Types of obstacles
    obstacleTypes = [
        {src: "muttiya.jpg", caption: "muttiya", injurious: false}/* , 
        {src: "mask.jpg", caption: "mask", injurious: false},
        {src: "plaintea.jpg", caption: "plaintea", injurious: false},
        {src: "sneeze.jpg", caption: "sneeze", injurious: true},
        {src: "zombie.jpg", caption: "zombie", injurious: true} */
    ];
}
  
init();

function startGame() {
    head = new component(30, 30, "#e8d295", 215, 120, "solid", "head");
    body = new component(40, 50, "blue", 210, 150, "solid", "body");
    leftHand = new component(10, 55, "#e8d295", 200, 150, "solid", "leftHand");
    rightHand = new component(25, 10, "#e8d295", 250, 150, "solid", "rightHand");
    leftLeg = new component(10, 45, "#e8d295", 215, 200, "solid", "leftLeg");
    rightLeg = new component(10, 45, "#e8d295", 235, 200, "solid", "rightLeg");
    bar = new component(10, 80, "black", 270, 80, "solid", "bar");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text", "myScore");
    leftBorder = new component(5, 270, "black", 0, 0, "solid", "leftBorder");
    rightBorder = new component(5, 270, "black", 475, 0, "solid", "rightBorder");
    myObstacles = [];
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.score = 0; // Health Edit #4
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type, caption) {
    this.caption = caption;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {

        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;

        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {

    for (i = 0; i < myObstacles.length; i += 1) {
        if (bar.crashWith(myObstacles[i])) {
            for(j=0; j<obstacleTypes.length; j++){
                if(myObstacles[i].caption == obstacleTypes[j].caption){
                    console.log("Obstacle is: " + obstacleTypes[j].caption); 
                    myGameArea.score += 1;
                }
            }
        }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;


    if (bar.crashWith(rightBorder)){
        wait = -1;
    }else if(leftHand.crashWith(leftBorder)){
        wait = 1;
    }

    moveHuman(wait);

    head.update();
    body.update();
    leftHand.update();
    rightHand.update();
    leftLeg.update();
    rightLeg.update();
    bar.update();
    leftBorder.update();
    rightBorder.update();

    // Score updating
    myScore.text = "SCORE: " + myGameArea.score;
    myScore.update();

    if (myGameArea.frameNo == 1 || everyinterval(50)) {
        x = myGameArea.canvas.width;
        myObstacles.push(new component(60, 70, obstacleTypes[0].src, x, 0, "image", obstacleTypes[0].caption));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -6; 
        myObstacles[i].newPos();
        myObstacles[i].update();
    }

    /* if (myGameArea.keys && myGameArea.keys[32]) {
        hit();
    } */
    
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function restartGame() { 
    var pause = document.getElementById("pause");
    var play = document.getElementById("play");
    play.disabled = true;
    pause.disabled = false;
    myGameArea.stop();
    myGameArea.clear();
    startGame();
}

function pause() {
    var pause = document.getElementById("pause");
    var play = document.getElementById("play");
    pause.disabled = true;
    play.disabled = false;
    myGameArea.stop();
}

function play() {
    var pause = document.getElementById("pause");
    var play = document.getElementById("play");
    play.disabled = true;
    pause.disabled = false;
    myGameArea.interval = setInterval(updateGameArea, 20);
}

function hit() {
    rightHand.width = 10;
    rightHand.height = 30;
    rightHand.y = 130;
    bar.x -= 20;
    bar.y -= 30;

    setTimeout(function(){ 
        rightHand.width = 25;
        rightHand.height = 10;
        rightHand.y = 150;
        bar.x += 20;
        bar.y += 30;
     }, 100);
    
}

function moveHuman(x) {
    head.speedX = x;
    head.newPos();

    body.speedX = x;
    body.newPos();

    rightHand.speedX = x;
    rightHand.newPos();

    leftHand.speedX = x;
    leftHand.newPos();

    rightLeg.speedX = x;
    rightLeg.newPos();

    leftLeg.speedX = x;
    leftLeg.newPos();

    bar.speedX = x;
    bar.newPos();
}
