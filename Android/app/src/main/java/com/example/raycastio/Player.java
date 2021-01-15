package com.example.raycastio;

import java.util.ArrayList;

import processing.core.PApplet;
import processing.core.PVector;

public class Player {

    PVector pos;
    double dir;
    float radius;
    double speed;
    PVector vel;
    String uname;
    String id;

    Player(float x, float y, String id, String name){
        this.pos = new PVector(x,y);
        this.radius = 5 * Sketch.scale;
        this.speed = 2 * Sketch.scale;
        this.vel = new PVector();
        this.uname = name;
        this.id = id;
    }
    public String getID(){
        return this.id;
    }
    public void setID(String id){
        this.id = id;
    }
    public void setUname(String name){
        this.uname = name;
    }
    public String getUname(){
        return this.uname;
    }
    public void setPos(float x, float y){
        this.pos.x = x;
        this.pos.y = y;
    }
    public PVector getPos(){
        return this.pos;
    }
    public  double getDir(){
        return this.dir;
    }
    public void move(int dx, int dy){
        if (dx==0 && dy ==0){return;}
        double angle = Math.atan2(-dy,dx);

        this.vel.x = (float) (this.speed * Math.cos(angle + (this.dir * Math.PI / 180)));
        this.vel.y = (float) (this.speed * Math.sin(angle + (this.dir * Math.PI / 180)));

        this.pos.add(this.vel);
    }
    public void setSpeed(int n){
        if(n==1){this.speed = 1* Sketch.scale;}
        else if(n==2){this.speed = 2*Sketch.scale;}
    }

    public void changeDir(float n){
        this.dir = n;
    }

    public void checkCollision(){
        playerCollision player = new playerCollision((float) this.radius,this.pos);

        float[][] walls = Walls.walls;

        for(float[] wall:walls){
            lineCollision line = new lineCollision(
                    new PVector(wall[0],wall[1]),
                    new PVector(wall[2],wall[3])
            );
            ArrayList<pointCollision> points = Collisions.interceptCircleLineSeg(player,line);

            if (points.size() > 0) {
                if (line.p1.x != line.p2.x) {
                    this.pos.y += -1 * this.vel.y;
                }
                if (line.p1.y != line.p2.y) {
                    this.pos.x += -1 * this.vel.x;
                }

            }

        }


    }

}
