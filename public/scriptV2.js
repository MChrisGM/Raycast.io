var socket;
var pID;
let canvas;
var aspect;
var nameField;
var randomLobbyBtn;
var createLobbyBtn;
var lobbyCode;
var lobbyCodeBtn;
var lobby = "";
var playerInfo = {
  names: [],
  positions: []
};
var pListDiv;
var lobbyCodeDiv;
let bg;
let player;
let otherP = [];
let chatDiv;
let chatInput;
let chatTextDiv;
var moving = true;
var paused = false;
let pauseDiv;

let fov = 60;
let lineWidth;
let res = 4;
let scale;
let initWalls = JSON.stringify(premadeWalls);
// let walls = [...premadeWalls];
let walls = JSON.parse(initWalls);
let sensX = 0.05;
let yAxis;

function preload() {
}

function socketFunctions() {
  socket = io.connect(window.location.href);

  socket.on('setPlayerId', function(data) {
    pID = data;
  });

  socket.on('clearUsername', function() {
    nameField.value("");
  });

  socket.on('joinLobby', function(data) {
    lobby = data;
    console.log("Lobby Code: " + data);
    console.log(typeof data);
    lobbyCodeDiv.html('Lobby Code: <div class="tooltip"><button class="copyCode" onclick="copyCode()" onmouseout="outFunc()"> <span class="tooltiptext" id="myTooltip">Copy to clipboard </span>' + lobby + '</button></div>');
    socket.emit('lobbyInfo');
  });

  socket.on('lobbyInfo', function(data) {
    playerInfo = data;
    pListDiv.html("<b><u>Players(" + playerInfo.names.length + "/10): " + "</u><br><i>" + playerInfo.names.join('<br>') + "</b></i>");

    otherP = [];
    for (var i = 0; i < playerInfo.ids.length; i++) {
      if (playerInfo.ids[i] != pID) {
        // otherP.push(new player(playerInfo.positions[i], 5, 0, 80, "blue", playerInfo.names[i], false, 100, playerInfo.ids[i]));
        otherP.push(new Player(playerInfo.positions[i].x, playerInfo.positions[i].y, playerInfo.ids[i], playerInfo.names[i]));
      } else {
        player.setUname(playerInfo.names[i]);
      }
    }
    chatInput.attribute("placeholder", "Message " + lobby);
  });

  socket.on('receiveMessage', function(data) {
    createMessage({ name: data.name, message: data.message, time: data.time });
  });
}

function UIFunctions() {
  nameField = createInput();
  nameField.input(submitName);
  nameField.id("usernameInput");
  nameField.attribute("placeholder", "Username");

  if (document.cookie != null && document.cookie != "") {
    nameField.value(document.cookie);
  }

  createLobbyBtn = createButton("Create Game");
  createLobbyBtn.id("createLobby");
  createLobbyBtn.mousePressed(createCustom);

  randomLobbyBtn = createButton("Random Game");
  randomLobbyBtn.mousePressed(joinRandom);
  randomLobbyBtn.id("randomLobby");

  lobbyCode = createInput();
  lobbyCode.id("codeLobby");
  lobbyCode.input(checkLobby);
  lobbyCode.attribute("placeholder", "Enter code");

  lobbyCodeBtn = createButton(">");
  lobbyCodeBtn.id("codeLobbyBtn");
  lobbyCodeBtn.mousePressed(joinCustom);

  pListDiv = createDiv();
  pListDiv.class('topleftcorner');
  pListDiv.id('playersDiv');

  lobbyCodeDiv = createDiv();
  lobbyCodeDiv.class('toprightcorner');
  lobbyCodeDiv.id('codeDiv');

  chatDiv = createDiv();
  chatDiv.class("bottomleftcorner");
  chatDiv.id('chatDiv');

  chatTextDiv = createDiv();
  chatTextDiv.parent(chatDiv);
  chatTextDiv.id('chatTextDiv');

  chatInput = createInput();
  chatInput.parent(chatDiv);
  chatInput.id('chatInput');
  chatInput.attribute("placeholder", "Message " + lobby);
  chatInput.mouseClicked(toggleChat);
  chatInput.changed(sendMessage);

  canvas.mouseClicked(toggleCanvas);

  pauseDiv = createDiv();
  pauseDiv.size(innerWidth, innerHeight);
  pauseDiv.id('pauseDiv');
  pauseDiv.center();
  pauseDiv.position(0, 0);
  pauseDiv.hide();
}

function setSize(resizing) {
  let pScale;
  let pPos;
  if (resizing) {
    pScale = scale;
    pPos = player.getPos();
  }
  if (window.innerHeight < window.innerWidth) {
    resizeCanvas(window.innerHeight, window.innerHeight);
    scale = window.innerHeight / 500;
  } else {
    resizeCanvas(window.innerWidth, window.innerWidth);
    scale = window.innerWidth / 500;
  }
  lineWidth = 1 + width / (fov * res);
  player = new Player(150 * scale, 150 * scale, pID);
  if (resizing) {
    let x = (pPos.x / pScale) * scale;
    let y = (pPos.y / pScale) * scale;
    player.setPos(x, y);
  }
  yAxis = height / 2;
  formatScale();
}

function formatScale() {
  for (var i = 0; i < walls.length; i++) {
    for (var j = 0; j < walls[i].length - 1; j++) {
      walls[i][j] *= scale;
    }
  }
}

function windowResized() {
  walls = JSON.parse(initWalls);
  setSize(true);
  pauseDiv.size(window.innerWidth, window.innerHeight);
}

function setup() {

  canvas = createCanvas();

  socketFunctions();

  setSize();

  UIFunctions();

  frameRate(60);

  pListDiv.hide();
  lobbyCodeDiv.hide();
  canvas.hide();
  hideMenu();
}

function sendMessage() {
  var text = chatInput.value();
  var username = player.getUname();
  socket.emit('sendMessage', { name: username, message: text, time: "" });
  chatInput.value(null);
}



function joinCustom() {
  submitName();
  var custom = lobbyCode.value();
  socket.emit('joinCustom', custom);
  socket.emit('sendMessage', { name: "", message: "" + player.getUname() + " connected!", time: "" });
  // socket.emit('sendMessage',{name: ""+player.getUname()+" connected!", message:""});
}

function joinRandom() {
  submitName();
  socket.emit('joinRandom');
  socket.emit('sendMessage', { name: "", message: "" + player.getUname() + " connected!", time: "" });
  // socket.emit('sendMessage',{name: ""+player.getUname()+" connected!", message:""});
}

function checkLobby() {
  if (lobbyCode.value().length > 5) {
    lobbyCode.value(lobbyCode.value().substring(0, lobbyCode.value().length - 1));
  }
}

function submitName() {
  if (nameField.value().length > 20) {
    nameField.value(nameField.value().substring(0, nameField.value().length - 1));
  } else {
    setName();
  }
}



function draw() {
  if (lobby != null && lobby != "") {
    canvas.show();
    hideMenu();
    background(51);

    main();

    pListDiv.show();
    lobbyCodeDiv.show();

    if (paused) {
      pauseDiv.show();
    } else if (!paused) {
      pauseDiv.hide();
    }

  } else {
    background(82);
    showMenu();
    player.setUname(nameField.value());
    document.cookie = nameField.value();
  }
}





function main() {

  rayCast();

  // for (let p of otherP) {
  //     let x = p.getPos().x * scale;
  //     let y = p.getPos().y * scale;
  //     stroke(0);
  //     strokeWeight(10);
  //     ellipse(x, y, p.radius, p.radius);
  // }


  let data = {
    x: player.getPos().x / scale,
    y: player.getPos().y / scale
  };
  socket.emit('updatePosition', data);
  socket.emit('lobbyInfo');

}

function rayCast() {
  if (moving && !paused) {
    requestPointerLock();
  }

  background(0);
  // background(80);

  strokeCap(ROUND);

  rays = [];

  playerSpeed();
  playerMovement();
  playerDirection();

  if (moving && !paused) {
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

  // //Display floor
  fill(80);
  rect(0, yAxis, width, 3 * height);

  let surface = {
    p1: { y: null, h: null },
    p2: { y: null, h: null }
  };

  const players = new Map()/*<string (username), [ int (firstXLine), int (lastXLine) ]>*/;

  for (var i = (dir - fov / 2); i < dir + fov / 2; i += 1 / res) {
    let ray = new Ray(x, y, i);

    let rayDistances = ray.getDist()

    rayDistances = rayDistances.reverse();

    for (let distance of rayDistances) {
      ray.setLength(distance[0] * cos((i - dir) * PI / 180));
      let rayDist = ray.getLength();

      push();
      translate(0, yAxis);
      let username = "";
      let lineStroke;
      if (rayDist > 0) {
        let xLine = map(i - dir, -fov / 2, fov / 2, 0, width);

        if (distance[2] == "player") {

          let color = hsvToRgb(200, 100, map(rayDist, 0, 800, 100, 50));
          lineStroke = { r: color[0], g: color[1], b: color[2] };

          if (players.get(distance[3]) == null) {
            players.set(distance[3], [xLine, xLine, rayDist]);
          } else {
            const firstXLine = players.get(distance[3])[0];
            players.set(distance[3], [firstXLine, xLine, rayDist]);
          }

        } else {
          lineStroke = { r: map(rayDist, 0, 800, 200, 100), g: map(rayDist, 0, 800, 200, 100), b: map(rayDist, 0, 800, 200, 100) };
        }

        strokeWeight(lineWidth);




        stroke(lineStroke.r, lineStroke.g, lineStroke.b);
        if (distance[1] > 0.5) {

          line(xLine, (distance[1]) * (30 * height * scale) / (2 * rayDist),
            xLine, (-30 * height * scale) / (2 * rayDist));

          // if (surface.p1.y != null && surface.p1.h == distance[1]) {
          //   surface.p2.y = (distance[1]) * (30 * height * scale) / (2 * rayDist);

          // } else {
          //   surface.p1.y = (-30 * height * scale) / (2 * rayDist);
          //   surface.p1.h = distance[1]; 
          // }
        }

        else if (distance[1] != 0 && distance[1] <= 0.5) {
          line(xLine, (30 * height * scale) / (2 * rayDist), xLine, (distance[1] - 0.5) * (-30 * height * scale) / (2 * rayDist));

          if (surface.p1.y != null && surface.p1.h == distance[1]) {
            surface.p2.y = (distance[1] - 0.5) * (-30 * height * scale) / (2 * rayDist);
          } else {
            surface.p1.y = (distance[1] - 0.5) * (-30 * height * scale) / (2 * rayDist);
            surface.p1.h = distance[1];
          }
        }
        if (surface.p1.y != null && surface.p2.y != null) {
          // stroke(0,0,255);
          line(xLine, surface.p1.y, xLine, surface.p2.y);
          surface = {
            p1: { y: null, h: null },
            p2: { y: null, h: null }
          };
        }


      }

      pop();

    }

    //Display Rays
    // strokeWeight(1);
    // stroke(255);
    // // ray.setLength(rayDist);
    // line(ray.getPos(1).x, ray.getPos(1).y, ray.getPos(2).x, ray.getPos(2).y);
  }

  //Display Dir
  // stroke(255, 0, 0);
  // strokeWeight(2);
  // let povLine = createVector(x + 1000 * sin(dir * PI / 180), y - 1000 * cos(dir * PI / 180));
  // line(x, y, povLine.x, povLine.y);

  displayNames(players);

  //Show crosshair
  fill(0, 255, 0);
  stroke(0);
  strokeWeight(1);
  ellipse(width / 2, height / 2, 5, 5);
}

function displayNames(players) {
  textAlign(CENTER);
  textStyle(NORMAL);
  strokeWeight(4);
  stroke(0);
  fill(255);


  push();
  translate(0, yAxis);

  for (let [username, xLines] of players) {
    const xLine = (xLines[0] + xLines[1]) / 2;
    textSize((8000 * scale) / xLines[2]);
    text(username, xLine, -20);
  }
  pop();
}

function playerMovement() {
  if (!paused && moving) {
    let dirX = 0;
    let dirY = 0;
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
    player.move(dirX, dirY);
  }

}
function playerSpeed() {
  if (!paused && moving) {
    if (keyIsDown(16)) {
      player.setSpeed(1);
    } else {
      player.setSpeed(2);
    }
  }
}

function playerDirection() {
  if (!paused && moving) {
    if (player.getDir() < -180) {
      player.dir = 180 + (180 + player.getDir());
    }
    if (player.getDir() > 180) {
      player.dir = -180 + (player.getDir() - 180);
    }
    player.changeDir(int(movedX) * sensX);
  }
}





