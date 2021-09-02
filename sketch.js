var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var ninja, ninja_running, ninja_collided, ninjaImage, zombie, zombie_running, zombie_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  ground_image = loadImage("Background.png");
  ninja_running = loadAnimation("Run__000.png", "Run__001.png", "Run__002.png", "Run__003.png" , "Run__004.png", "Run__005.png", "Run__006.png", "Run__007.png", "Run__008.png", "Run__009.png");
  zombie_running = loadAnimation("Walk (1).png", "Walk (2).png", "Walk (3).png", "Walk (4).png", "Walk (5).png", "Walk (6).png", "Walk (7).png", "Walk (8).png", "Walk (9).png", "Walk (10).png");
  zombie_attack = loadAnimation("Attack (2).png", "Attack (3).png", "Attack (4).png", "Attack (5).png", "Attack (6).png", "Attack (7).png", "Attack (8).png");
  obstacle1 = loadImage("obstacle1.png");
  zombie_idle = loadImage("Stand.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1.png");
  ninja_collided = loadImage("Dead__000.png", "Dead__001.png", "Dead__002.png", "Dead__003.png", "Dead__004.png", "Dead__005.png", "Dead__006.png", "Dead__007.png", "Dead__008.png", "Dead__009.png");
  ninjaImage = loadImage("Slide__000.png", "Slide__001.png","Slide__002.png","Slide__003.png","Slide__004.png","Slide__005.png","Slide__006.png","Slide__007.png","Slide__008.png", "Slide__009.png",);
}

function setup() {
  createCanvas(600, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  ninja = createSprite(300, 420, 600, 10);
  ninja.addAnimation("ninja_running", ninja_running);
  ninja.addImage("ninja_collided", ninja_collided);
  ninja.addImage("ninjaImage", ninjaImage);
  ninja.scale = 0.2;
  // ninja.velocityX=2;
  ninja.debug = false;
  ninja.setCollider("rectangle", 0, 0, ninja.width, ninja.height)


  zombie = createSprite(50, 410, 600, 10);
  zombie.addAnimation("zombie_running", zombie_running);
  zombie.addAnimation("zombie_attack", zombie_attack);
  zombie.addImage("zombie_idle", zombie_idle);
  zombie.scale = 0.2;
  zombie.debug = false;
  // zombie.velocityY=-13;
  // zombie.velocityX=Math.round(random(1,2));

  invisible_ground = createSprite(300, 470, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");

  // console.log(ninja.y);
  //Gravity
  ninja.velocityY = ninja.velocityY + 0.8;
  ninja.collide(invisible_ground);

  //Gravity
  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invisible_ground);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=ninja.y;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(zombie)) {
      zombie.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if ((keyDown("space") && ninja.y >= 220)) {
      ninja.velocityY = -12;
      jumpSound.play();
    }

    if (ninja.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    ninja.velocityY = 0
    ninja.changeImage("ninjaImage", ninjaImage);
    zombie.changeAnimation("zombie_attack", zombie_attack);
    zombie.x = ninja.x;
    if (zombie.isTouching(ninja)) {
      ninja.changeImage("ninja_collided", ninja_collided);
      zombie.changeImage("zombie_idle", zombie_idle);
    }
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("lightpink");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ninja.changeAnimation("ninja_running", ninja_running);
  obstaclesGroup.destroyEach();
  score = 0;
  zombie.x = 50;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);
    obstacle.velocityX = -6; //+ score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
  }

}