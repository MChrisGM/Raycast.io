class Player {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.dir = 0;
        this.radius = 20 * scale;
        this.speed = 2 * scale;
    }
    getPos() {
        return this.pos;
    }
    getDir() {
        return this.dir;
    }
    move(dx,dy) {
      if (dx ==0 && dy == 0){return;}
      let angle = Math.atan2(-dy,dx);

        this.pos.x += this.speed * Math.cos(angle + (this.dir * PI / 180));
        this.pos.y += this.speed * Math.sin(angle + (this.dir * PI / 180));
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



}