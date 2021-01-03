let canvas;
let socket;
let player;
let fov = 75;
let lineWidth;
let res = 4;
let scale;
let walls = premadeWalls;
let sensX = 0.05;
let yAxis;

function setup() {
  socket = io.connect(window.location.href);
  setSize();
}

function windowResized() {
  walls = premadeWalls;
  setSize();
}

function setSize(){
  if (window.innerHeight < window.innerWidth) {
    canvas = createCanvas(window.innerHeight, window.innerHeight);
    scale = height / 500;
  } else {
    canvas = createCanvas(window.innerWidth, window.innerWidth);
    scale = width / 500;
  }
  lineWidth = 1 + width / (fov*res);
  player = new Player(150 * scale, 150 * scale);
  yAxis = height / 2;
  formatScale();
}

function formatScale() {
  for (var i = 0; i < walls.length; i++) {
    for (var j = 0; j < walls[i].length; j++) {
      walls[i][j] *= scale;
    }
  }
}


function draw() {
  requestPointerLock();
  background(0);
  // background(80);
  rays = [];

  if (keyIsDown(16)) {
    player.setSpeed(1);
  } else {
    player.setSpeed(2);
  }

  playerMovement();


  if (player.getDir() < -180) {
    player.dir = 180 + (180 + player.getDir());
  }
  if (player.getDir() > 180) {
    player.dir = -180 + (player.getDir() - 180);
  }
  player.changeDir(int(movedX) * sensX);


  if (yAxis <= 2 * height && yAxis >= -height) {
    yAxis -= movedY;
  } else {
    if (yAxis > 2 * height) {
      yAxis -= 1;
    }
    if (yAxis < -height) {
      yAxis += 1;
    }
  }

  player.checkCollision();

  let x = player.getPos().x;
  let y = player.getPos().y;
  let dir = player.getDir();

  // console.log(player.getPos());

  // Display walls
  // stroke(0);
  // strokeWeight(10);
  // ellipse(x, y, player.radius, player.radius);
  // for (let wall of walls) {
  //     line(wall[0], wall[1], wall[2], wall[3]);
  // }

  //Display floor
  fill(80);
  rect(0, yAxis, width, 2 * height);

  for (var i = (dir - fov / 2); i < dir + fov / 2; i += 1 / res) {
    let ray = new Ray(x, y, i);
    let rayDist = ray.getDist();
    ray.setLength(rayDist * cos(i * PI / 180));

    push();
    translate(0, yAxis);
    if (rayDist > 0) {
      stroke(map(rayDist, 0, 800, 200, 100));
      strokeWeight(lineWidth);
      let xLine = map(i - dir, -fov / 2, fov / 2, 0, width);
      line(xLine, 20000 * scale * (1 / (rayDist)), xLine, 20000 * scale * (-1 / (rayDist)));
    }
    pop();
    //Display Rays
    // strokeWeight(1);
    // stroke(255);
    // ray.setLength(rayDist);
    // line(ray.getPos(1).x, ray.getPos(1).y, ray.getPos(2).x, ray.getPos(2).y);
  }

  //Display Dir
  // stroke(255, 0, 0);
  // strokeWeight(2);
  // let povLine = createVector(x + 1000 * sin(dir * PI / 180), y - 1000 * cos(dir * PI / 180));
  // line(x, y, povLine.x, povLine.y);


  // //Show crosshair
  fill(0, 255, 0);
  stroke(0);
  strokeWeight(1);
  ellipse(width / 2, height / 2, 5, 5);


}
function playerRotate() {
  if (keyIsDown(LEFT_ARROW)) {
    player.changeDir(-2);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.changeDir(2);
  }
}


function playerMovement() {
  let dirX=0;
  let dirY=0;
  if (keyIsDown(87)) { //W
    dirY += 1;
  }
  if (keyIsDown(65)) { //A
    dirX -= 1;
  }
  if (keyIsDown(83)) {  //S
    dirY -= 1;
  }
  if (keyIsDown(68)) {  //D
    dirX += 1;
  }
  player.move(dirX,dirY);
}
