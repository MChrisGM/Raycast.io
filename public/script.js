let canvas;
let socket;
var w = window.innerWidth;
var h = window.innerHeight;
let player;
let fov = 75;
let lineWidth;
let res = 1;
let premadeWalls = [
    [0, 200, 100, 200, 1], [100, 0, 100, 200, 1],
    [125, 225, 200, 225, 1], [125, 225, 125, 275, 1], [125, 275, 200, 275, 1], [200, 275, 200, 225, 1],
    [100, 350, 225, 350, 1], [100, 350, 100, 450, 1], [100, 450, 150, 450, 1], [150, 450, 150, 400, 1], [150, 400, 225, 400, 1], [225, 400, 225, 350, 1],
    [250, 100, 250, 300, 1], [250, 100, 300, 100, 1], [300, 100, 300, 200, 1], [300, 200, 400, 200, 1], [400, 200, 400, 250, 1], [400, 250, 300, 250, 1], [300, 250, 300, 300, 1], [300, 300, 250, 300, 1],
    [375, 0, 375, 125, 1], [375, 125, 500, 125, 1],
    [425, 325, 500, 325, 1], [425, 325, 425, 375, 1], [425, 375, 500, 375, 1],
    [325, 450, 325, 500, 1], [325, 450, 400, 450, 1], [400, 450, 400, 500, 1]

];
let scale;
let walls = premadeWalls;
let sensX = 0.05;
let yAxis;

function setup() {
    socket = io.connect(window.location.href);
    if (window.innerHeight < window.innerWidth) {
        canvas = createCanvas(window.innerHeight, window.innerHeight);
        scale = height / 500;
    } else {
        canvas = createCanvas(window.innerWidth, window.innerWidth);
        scale = width / 500;
    }
    background(0);
    lineWidth = 1 + width / (fov * res);
    walls.push([0, 0, 500, 0]);
    walls.push([0, 0, 0, 500]);
    walls.push([500, 0, 500, 500]);
    walls.push([0, 500, 500, 500]);

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
    // console.log(walls);
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
    moveplayer();
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

    let x = player.getPos().x;
    let y = player.getPos().y;
    let dir = player.getDir();

    // Display walls
    // stroke(0);
    // strokeWeight(10);
    // ellipse(x, y, 20, 20);
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
            pop();
        }
        // //Display Rays
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

function windowResized() {
    walls = [];
    if (window.innerHeight < window.innerWidth) {
        canvas = createCanvas(window.innerHeight, window.innerHeight);
        scale = height / 500;
    } else {
        canvas = createCanvas(window.innerWidth, window.innerWidth);
        scale = width / 500;
    }
    background(80);
    lineWidth = 1 + width / (fov * res);
    walls.push([0, 0, 500, 0]);
    walls.push([0, 0, 0, 500]);
    walls.push([500, 0, 500, 500]);
    walls.push([0, 500, 500, 500]);

    for (let wall of premadeWalls) {
        walls.push(wall);
    }
    formatScale();
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }
    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    // Lines are parallel
    if (denominator === 0) {
        return false
    }
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }
    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
    return { x, y }
}


function moveplayer() {
    if (player.getPos().x > player.radius / 2 && player.getPos().x < width - player.radius / 2 && player.getPos().y > player.radius / 2 && player.getPos().y < height - player.radius / 2) {
        //first check diagonal
        if (keyIsDown(87) && keyIsDown(65)) { //W and A
            player.move(-Math.PI * 3 / 4);
        } else if (keyIsDown(65) && keyIsDown(83)) { //A and S
            player.move(Math.PI * 3 / 4);
        } else if (keyIsDown(83) && keyIsDown(68)) {  //S and D
            player.move(Math.PI / 4);
        } else if (keyIsDown(68) && keyIsDown(87)) {  //D and W
            player.move(-Math.PI / 4);
            //check normal
        } else if (keyIsDown(87)) { //W
            player.move(-Math.PI / 2);
        } else if (keyIsDown(65)) { //A
            player.move(-Math.PI);
        } else if (keyIsDown(83)) {  //S
            player.move(Math.PI / 2);
        } else if (keyIsDown(68)) {  //D
            player.move(0);
        }
    } else {
        if (player.getPos().x < player.radius / 2) {
            player.move(0);
        } else if (player.getPos().x > width - player.radius / 2) {
            player.move(-Math.PI);
        } else if (player.getPos().y < player.radius / 2) {
            player.move(Math.PI / 2);
        } else if (player.getPos().y > height - player.radius / 2) {
            player.move(-Math.PI / 2);
        }
    }
}