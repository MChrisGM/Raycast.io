class Player {
  constructor(x, y, id, name) {
    this.pos = createVector(x, y);
    this.dir = 0;
    this.radius = 10 * scale;
    this.speed = 2 * scale;
    this.vel = createVector();
    this.uname = name;
    this.id = id;
  }
  setID(id) {
    this.id = id;
  }
  setUname(name) {
    this.uname = name;
  }
  getUname() {
    return this.uname;
  }

  getPos() {
    return this.pos;
  }
  getDir() {
    return this.dir;
  }
  move(dx, dy) {
    if (dx == 0 && dy == 0) { return; }
    let angle = Math.atan2(-dy, dx);

    this.vel.x = this.speed * Math.cos(angle + (this.dir * PI / 180));
    this.vel.y = this.speed * Math.sin(angle + (this.dir * PI / 180));

    this.pos.add(this.vel);
  }
  setSpeed(n) {
    if (n == 1) {
      this.speed = 1 * scale;
    } else if (n == 2) {
      this.speed = 2 * scale;
    }

  }
  changeDir(n) {
    this.dir += n;
  }

  checkCollision() {
    let player = {
      radius: this.radius,
      center: this.pos,
    };
    for (let wall of walls) {
      var line = {
        p1: createVector(wall[0], wall[1]),
        p2: createVector(wall[2], wall[3]),
      }
      let points = inteceptCircleLineSeg(player, line);

      if (points.length > 0) {
        if (line.p1.x != line.p2.x) {
          this.pos.y += -1 * this.vel.y
        }
        if (line.p1.y != line.p2.y) {
          this.pos.x += -1 * this.vel.x
        }

      }

    }
  }

}


// class player {

//   constructor(pos, speed, direction, size, team, username, host, health, id) {//there was a score filed i added and now removed
//     this.position = createVector(pos.x, pos.y);
//     this.speed = speed;
//     this.radius = size;
//     this.team = team;
//     this.uname = username;
//     this.lookAt = direction;
//     this.isHost = host;
//     this.helf = health;
//     this.id = "" + id + "";
//     // this.scr = score;
//   }

//   move(angle) {
//     this.position.x += this.speed * Math.cos(angle);
//     this.position.y += this.speed * Math.sin(angle);
//   }

//   update() {
//     if (this.helf > 0) {
//       // fill(50,255,50);
//       // noStroke();
//       // rect(this.position.x-this.radius*3/4,this.position.y-this.radius+1,((this.radius*3/2)/100)*this.helf,this.radius-32,20);

//       fill(255);
//       // noStroke();
//       stroke(0);
//       strokeWeight(1);
//       textAlign(CENTER);
//       textSize(9);

//       // text(floor(this.helf)+" / 100",this.position.x,this.position.y-this.radius*51/64);
//     }
//   }

//   goTo(x, y) {
//     this.position.x = x;
//     this.position.y = y;
//   }

//   display() {
//     push();
//     translate(this.position.x, this.position.y);
//     if (this.isHost && this.helf > 0) {
//       this.lookAt = createVector(mouseX - this.position.x, mouseY - this.position.y).heading() + PI / 2;
//     }
//     if (this.helf <= 0) {
//       this.lookAt = PI + 0.2;
//     }
//     rotate(this.lookAt);
//     strokeWeight(2);
//     stroke(140);
//     fill(180);
//     //   rect(0-this.radius/4,0-this.radius/1.2,this.radius/2,this.radius/2);

//     if (this.team == "blue") {
//       stroke(40, 90, 255);
//       fill(110, 180, 255);
//     } else {
//       stroke(255, 20, 20);
//       fill(255, 120, 120);
//     }

//     ellipse(0, 0, this.radius, this.radius);
//     pop();
//     stroke(0);
//     fill(255);
//     strokeWeight(4);
//     textSize(40);
//     text(this.uname + "", this.position.x, this.position.y - this.radius + 30);

//     //   fill(0);
//     //   stroke(0);
//     //   strokeWeight(5);
//     //   rect(this.position.x-this.radius*3/4,this.position.y-this.radius+1,this.radius+this.radius/2,this.radius-32,5);
//   }

//   getLookAt() {
//     return this.lookAt;
//   }

//   getPos() {
//     return { x: this.position.x, y: this.position.y };
//   }

//   setUname(username) {
//     this.uname = username;
//   }

//   getTeam() {
//     return this.team;
//   }

//   getUname() {
//     return this.uname;
//   }

//   // setID(serverID){
//   //   this.id = serverID;
//   // }

//   // collision(bullet){
//   //   if(currentP.helf>0){
//   //     if(this.team != bullet.team){
//   //       if(dist(this.position.x,this.position.y,bullet.pos.x,bullet.pos.y) <= this.radius/2 + bullet.r/2  && bullet.frm != this.uname){
//   //         this.helf -= bullet.dmg;
//   //         if(this.helf<=0){
//   //           socket.emit('addScoreToPlayer',bullet.frm);
//   //         }
//   //         return true;
//   //       }else{
//   //         return false;
//   //       }
//   //     }
//   //   }
//   // }
// }