class Ray {
    constructor(x, y, d, dist) {
        this.pos1 = createVector(x, y);
        this.dir = d;
        this.l = 2000;
        this.pos2;
        this.pos2 = createVector(x + this.l * sin(d * PI / 180), y - this.l * cos(d * PI / 180));
    }
    setLength(length) {
        this.l = length;
        this.pos2 = createVector(this.pos1.x + this.l * sin(this.dir * PI / 180), this.pos1.y - this.l * cos(this.dir * PI / 180));
    }

    getLength(){
      return this.l;
    }

    getDir() {
        return this.dir;
    }
    getPos(n) {
        if (n == 1) {
            return this.pos1;
        } else if (n == 2) {
            return this.pos2;
        }
    }
    getDist() {
        let distances = [];
        for (let wall of walls) {
            let point = intersect(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y, wall[0], wall[1], wall[2], wall[3]);
            if (point != false) {
                // distances.push([dist(this.pos1.x, this.pos1.y, point.x, point.y), wall[4]]);
                distances.push(dist(this.pos1.x, this.pos1.y, point.x, point.y));
            }
        }
        // for(let elm of distances){

        // }

        if (distances.length > 0) {
            return min(distances);
        } else {
            return 0;
        }

    }


}