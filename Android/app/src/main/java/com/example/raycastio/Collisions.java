package com.example.raycastio;

import java.util.ArrayList;

public class Collisions {
    public static ArrayList<pointCollision> interceptCircleLineSeg(playerCollision circle, lineCollision line){

        ArrayList<pointCollision> ret =  new ArrayList<pointCollision>();
        pointCollision v1 = new pointCollision(0,0);
        pointCollision v2 = new pointCollision(0,0);
        v1.x = line.p2.x - line.p1.x;
        v1.y = line.p2.y - line.p1.y;
        v2.x = line.p1.x - circle.center.x;
        v2.y = line.p1.y - circle.center.y;
        float b = (v1.x * v2.x + v1.y * v2.y);
        float c = 2 * (v1.x * v1.x + v1.y * v1.y);
        b *= -2;
        Double d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
        if(d.isNaN()){ // no intercept
            return ret;
        }
        double u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
        double u2 = (b + d) / c;
        pointCollision retP1 = new pointCollision(0,0);   // return points
        pointCollision retP2 = new pointCollision(0,0);
//        ret = []; // return array
        if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
            retP1.x = (float) (line.p1.x + v1.x * u1);
            retP1.y = (float) (line.p1.y + v1.y * u1);
            ret.set(0, retP1);
        }
        if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
            retP2.x = (float) (line.p1.x + v1.x * u2);
            retP2.y = (float) (line.p1.y + v1.y * u2);
            ret.set(1, retP2);
        }
        return ret;

    }

    public static pointCollision intersect(float x1,float y1,float x2,float y2,float x3,float y3,float x4,float y4){
        // Check if none of the lines are of length 0
        pointCollision point = new pointCollision(0,0);
        if ((x1 == x2 && y1 == y2) || (x3 == x4 && y3 == y4)) {
            return new pointCollision(false);
        }
        float denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        // Lines are parallel
        if (denominator == 0) {
            return new pointCollision(false);
        }
        float ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        float ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return new pointCollision(false);
        }
        // Return a object with the x and y coordinates of the intersection
        point.x = x1 + ua * (x2 - x1);
        point.y = y1 + ua * (y2 - y1);
        return point;
    }

}
