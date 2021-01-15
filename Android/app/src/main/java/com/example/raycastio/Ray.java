package com.example.raycastio;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import processing.core.PVector;

import static java.lang.Math.cos;
import static java.lang.Math.sin;

public class Ray {
    PVector pos1;
    float dir;
    float l;
    PVector pos2;

    Ray(float x, float y, float d) {
        this.pos1 = new PVector(x, y);
        this.dir = d;
        this.l = 2000;
        this.pos2 = new PVector((float) (x + this.l * sin(d * Math.PI / 180)), (float) (y - this.l * cos(d * Math.PI / 180)));
    }

    public void setLength(float length) {
        this.l = length;
        this.pos2 = new PVector((float) (this.pos1.x + this.l * sin(this.dir * Math.PI / 180)), (float) (this.pos1.y - this.l * cos(this.dir * Math.PI / 180)));
    }

    public float getLength() {
        return this.l;
    }

    public float gerDir() {
        return this.dir;
    }

    public PVector getPos(int n) {
        if (n == 1) {
            return this.pos1;
        } else if (n == 2) {
            return this.pos2;
        }
        return new PVector();
    }

    public ArrayList<Object[]> getDist() {
        ArrayList<Object[]> distances = new ArrayList<Object[]>();

        float[][] walls = Walls.walls;

        for (float[] wall : walls) {
            pointCollision point = Collisions.intersect(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y, wall[0], wall[1], wall[2], wall[3]);
            if (point.exists != false) {
                // distances.push([dist(this.pos1.x, this.pos1.y, point.x, point.y), wall[4]]);

                distances.add(new Object[]{
                                Functions.dist(this.pos1.x, this.pos1.y, point.x, point.y),
                                wall[4],
                                "wall",
                                point,
                                new pointCollision(wall[0], wall[1]),
                                new pointCollision(wall[2], wall[3])
                        }
                );
            }
        }
        ArrayList<Player> otherP = PlayersList.otherP;

//        if (otherP == null) {
//            return new ArrayList<>();
//        }
//        for (Player pla : PlayersList.otherP) {
//            PVector pos = pla.getPos();
//            float rad = pla.radius;
//
//            playerCollision player = new playerCollision(rad, pos);
//
//            lineCollision line = new lineCollision(this.pos1, this.pos2);
//
//            ArrayList<pointCollision> points = Collisions.interceptCircleLineSeg(player, line);
//
//            boolean point = true;
//
//            if (points.size() > 0) {
//                if (point) {
//                    distances.add(new Object[]{
//                                    Functions.dist(points.get(0).x, points.get(0).y, this.pos1.x, this.pos1.y),
//                                    0.5,
//                                    "player",
//                                    pla.getUname(),
//                                    pla.getID()
//                            }
//                    );
//                } else {
//                    distances.add(new Object[]{
//                                    Functions.dist(points.get(0).x, points.get(0).y, this.pos1.x, this.pos1.y),
//                                    0.5,
//                                    "player"
//                            }
//                    );
//                }
//            }
//        }

        Comparator<Object[]> sorting = (Object[] a, Object[] b) -> ((float) a[0] == (float) b[0]) ? 0 : ((float) a[0] < (float) b[0]) ? -1 : 1;
        Collections.sort(distances, sorting);

        ArrayList<Object[]> rays = new ArrayList<Object[]>();
        float maxH = 0;
        float minD = 0;
        for (Object[] elm : distances) {
            if ((float) elm[0] > minD && maxH != 1) {
                rays.add(elm);
                maxH = (float) elm[1];
                minD = (float) elm[0];
            }
        }

        if (rays.size() > 0) {
            return rays;
        } else {
            return null;
        }

    }

}



//    private static int sorting(Object[] a, Object[] b){
//        if ((float)a[0] == (float)b[0]) {return 0;}else {return ((float)a[0] < (float)b[0]) ? -1 : 1;}
//    }

