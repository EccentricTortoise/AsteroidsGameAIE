// Asteroid game code:

// Making the canvas:
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// Delta time set:
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

function getDeltaTime()	    // Only call this function once per frame
{
     endFrameMillis = startFrameMillis;
     startFrameMillis = Date.now();
     var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
     if (deltaTime > 1)        // validate that the delta is within range
     {
         deltaTime = 1;
     }	
     return deltaTime;
}

// Constant values for the game states:
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameState = STATE_SPLASH;

////////////////////Player
var Player = document.createElement("img");
Player.src = "Images/small_ship.png";
Player.X = canvas.width/2;
Player.Y = canvas.height/2;
Player.HitRadius = 30;

Player.MinX = Player.X - Player.HitRadius/2;
Player.MaxX = Player.X + Player.HitRadius/2;
Player.MinY = Player.Y - Player.HitRadius/2;
Player.MaxY = Player.Y + Player.HitRadius/2;

Player.Speed = 6;
Player.Angle = 0;
Player.Thrust = 0;
Player.VelocityX = 0;
Player.VelocityY = 0;
Player.RotateSpeed = 0.09;

var RockArray = [];
for (var i = 0; i < 8; i++)
{
	var Rock = document.createElement("img");
	Rock.src = "Images/asteroid.png";
	Rock.X = canvas.width/4 + 10*i;
	Rock.Y = canvas.height/4;
	Rock.Angle = 0;
	Rock.HitRadius = 63;
	Rock.RotateSpeed = Math.random() * 0.04 - 0.02;

	Rock.MinX = Rock.X - Rock.HitRadius/2;
	Rock.MaxX = Rock.X + Rock.HitRadius/2;
	Rock.MinY = Rock.Y - Rock.HitRadius/2;
	Rock.MaxY = Rock.Y + Rock.HitRadius/2;
	
	Rock.VelocityX = Math.random() * 2 - 1;
	Rock.VelocityY = Math.random() * 2 - 1;
	
	RockArray[i] = Rock;
}

var KeyUpDown = false;
var KeyDownDown = false;
var KeySpaceDown = false;
var KeyLeftDown = false; 
var KeyRightDown = false;

// Key codes:
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

// Checking the keys
window.addEventListener('keydown', function(evt) { onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);

function onKeyDown(event)
{
	if(event.keyCode === KEY_UP)
		KeyUpDown = true;
		
	if (event.keyCode === KEY_DOWN)
		KeyDownDown = true;
	
	if (event.keyCode === KEY_SPACE)
		KeySpaceDown = true;
		
	if (event.keyCode === KEY_LEFT)
		KeyLeftDown = true;
	
	if (event.keyCode === KEY_RIGHT)
		KeyRightDown = true;
}

function onKeyUp(event)
{
	if(event.keyCode === KEY_UP)
		KeyUpDown = false;
		
	if (event.keyCode === KEY_DOWN)
		KeyDownDown = false;
	
	if (event.keyCode === KEY_SPACE)
		KeySpaceDown = false;
		
	if (event.keyCode === KEY_LEFT)
		KeyLeftDown = false;
	
	if (event.keyCode === KEY_RIGHT)
		KeyRightDown = false;
}
 
 //moving the asteroids:
 function moveRocks()
 {
	for (var i = 0; i < RockArray.length; i++)
	{
		RockArray[i].Angle += RockArray[i].RotateSpeed;
	
		RockArray[i].X += RockArray[i].VelocityX;
		RockArray[i].Y += RockArray[i].VelocityY;
		
		//left
		if (RockArray[i].X + RockArray[i].Y/2 < 0)
			RockArray[i].X = canvas.width + RockArray[i].width/2;
		
		//right
		if (RockArray[i].X - RockArray[i].width/2 > canvas.width)
			RockArray[i].X = 0 - RockArray[i].width/2;
			
		//top
		if (RockArray[i].Y + RockArray[i].height/2 < 0)
			RockArray[i].Y = canvas.height + RockArray[i].height/2;
		
		//bottom		
		if (RockArray[i].Y - RockArray[i].height /2 > canvas.height)
			RockArray[i].Y = 0 - RockArray[i].height/2;
			
		RockArray[i].MinX = RockArray[i].X - RockArray[i].HitRadius/2;
		RockArray[i].MaxX = RockArray[i].X + RockArray[i].HitRadius/2;
		RockArray[i].MinY = RockArray[i].Y - RockArray[i].HitRadius/2;
		RockArray[i].MaxY = RockArray[i].Y + RockArray[i].HitRadius/2;
	}
 }
 
 // Moving the ship:
function moveShip()
 {
	if (KeyUpDown)
	{
		Player.Thrust -= Player.Speed/10;
		
		if (Player.Thrust > Player.Speed)
			Player.Thrust += Player.Speed/10;
	}
	else if (KeyDownDown)
	{
		Player.Thrust += Player.Speed/10;
		
		if (Player.Thrust < -Player.Speed)
			Player.Thrust -= Player.Speed/10;
	}
	else //Friction and no thrust
	{
		if (Player.Thrust > 0)
			Player.Thrust -= Player.Speed/20;
		else if (Player.Thrust < 0)
			Player.Thrust += Player.Speed/20;
		
		if (-(Player.Speed/20) < Player.Thrust && Player.Thrust < (Player.Speed/20))
			Player.Thrust = 0;
	}
	
	//Get CurDirection 
	var CurSpeed = Math.sqrt( Math.pow(Player.VelocityX, 2) + Math.pow(Player.VelocityY, 2));
	if (CurSpeed != 0)
	{
		//gets direction of the player velocity
		var CurPlayerDirectionX = Player.VelocityX / CurSpeed * 0.01;
		var CurPlayerDirectionY = Player.VelocityY / CurSpeed * 0.01;
		
		Player.VelocityX -= CurPlayerDirectionX;
		Player.VelocityY -= CurPlayerDirectionY;
		
		
		if (CurSpeed < 0.01)
		{
			Player.VelocityX = 0;
			Player.VelocityY = 0;
		}//derp
		
		//MaxSpeed
		if (CurSpeed >  Player.Speed)
		{
			Player.VelocityX = CurPlayerDirectionX * Player.Speed;
			Player.VelocityY = CurPlayerDirectionY * Player.Speed;
		}
	}

	//Gets the vector from our playerAngle
	var SinAngle = Math.sin(Player.Angle + (Math.PI/4));
	var CosAngle = Math.cos(Player.Angle + (Math.PI/4));
	
	var newVelocityX = ((CosAngle) - (SinAngle));
	var newVelocityY = (SinAngle + CosAngle);
	
	newVelocityX = (newVelocityX) * Player.Thrust;
	newVelocityY = (newVelocityY) * Player.Thrust;
	
	Player.VelocityX += newVelocityX;
	Player.VelocityY += newVelocityY;
	
	//Actually MOVE PLAYER
	Player.X += Player.VelocityX;
	Player.Y += Player.VelocityY;
		
	if (KeyLeftDown)
	{
		Player.Angle -= Player.RotateSpeed; 
	}
	
	if (KeyRightDown)
	{
		Player.Angle += Player.RotateSpeed;
	}
	 //STITCH THE WALLS OF OUT LEVEL
	//left
	if (Player.X + Player.width/2 < 0)
		Player.X = canvas.width + Player.width/2;
	
	//right
	if (Player.X - Player.width/2 > canvas.width)
		Player.X = 0 - Player.width/2;
		
	//top
	if (Player.Y + Player.height/2 < 0)
		Player.Y = canvas.height + Player.height/2;
	
	//bottom		
	if (Player.Y - Player.height /2 > canvas.height)
		Player.Y = 0 - Player.height/2;
		
	Player.MinX = Player.X - Player.HitRadius/2;
	Player.MaxX = Player.X + Player.HitRadius/2;
	Player.MinY = Player.Y - Player.HitRadius/2;
	Player.MaxY = Player.Y + Player.HitRadius/2;
 }
 
 // Checking for collision:
function checkCircleCollision(x1, y1, radius1, x2, y2, radius2)
 {
	var Distance = Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2 ,2));
	
	if (Distance < radius1 + radius2)
		return true;
	
	return false;
 }

 function checkAABBCollision( 	MinX1, MinY1, MaxX1, MaxY1,
								MinX2, MinY2, MaxX2, MaxY2)
 {
	if ((MaxX1 < MinX2) ||
		(MinX1 > MaxX2) ||
		(MaxY1 < MinY2) ||
		(MinY1 > MaxY2))
		return false;
	
	return true;
 }
 
 // Checking for collision:
 function CheckPlayerCollide()
 {
	var isPlayerColliding = false;
	
	for (var i = 0; i < RockArray.length; i++)
	{
		isPlayerColliding = (checkAABBCollision( 	Player.MinX, Player.MinY,
												Player.MaxX, Player.MaxY,
											    RockArray[i].MinX, RockArray[i].MinY,
											    RockArray[i].MaxX, RockArray[i].MaxY));
		if (isPlayerColliding) 
			break;
	}
 
	if (isPlayerColliding)
	 {
		gameState = STATE_GAMEOVER;
//		Player.VelocityX = -Player.VelocityX;
//		Player.VelocityY = -Player.VelocityY;
		
//		Player.X += Player.VelocityX;
//		Player.Y += Player.VelocityY;
	 }
 }
 
 //Drawing the asteroids:
 function drawRocks()
{
	for (var i = 0; i < RockArray.length; i++)
	{
		context.save();
			context.translate(RockArray[i].X, RockArray[i].Y);
			context.rotate(RockArray[i].Angle);
			context.scale(1,1);
			context.drawImage(RockArray[i], -RockArray[i].width/2, -RockArray[i].height/2);
		context.restore();
	
		context.beginPath();
		//context.arc(AsteroidX, AsteroidY, AsteroidHitRadius, 0, 2*Math.PI );
		context.rect(RockArray[i].MinX,
					 RockArray[i].MinY,
					 RockArray[i].MaxX - RockArray[i].MinX,
					 RockArray[i].MaxY - RockArray[i].MinY );
		context.stroke();
	}
}

// Drawing the ship:
 function drawShip()
 {	
	context.save();
		context.translate(Player.X,Player.Y);
		context.rotate(Player.Angle);
		context.scale(0.5,0.5);
		context.drawImage(Player, -Player.width/2, -Player.height/2);
	context.restore();
	
	context.beginPath();
	
	context.rect(Player.MinX,
			Player.MinY,
			Player.MaxX - Player.MinX,
			Player.MaxY - Player.MinY );
				
	context.stroke();
 }
 
 function draw()
 {
	//fill background
 	context.fillStyle = "#000000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawRocks();
 	drawShip();
 }
 
 var splashTimer = 3;
 function runSplash(deltaTime)
 {
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		gameState = STATE_GAME;
		return;
	}
	
	context.fillStyle = "#0000FF";
	context.font="24px Arial";
	context.fillText("Loading...", 200, 240);
 }
 
 function runGame()
 {
	moveShip();
	moveRocks();
	CheckPlayerCollide();
	draw();

 }
 
 function runGameOver()
 {
	context.fillStyle = "#FF0000";
	context.font = "24px Arial";
	context.fillText("You died...", 200, 240);
 }
 
function run()
{
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
}

// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);