package com.example.raycastio;

public class pointCollision {
    float x;
    float y;
    boolean exists;
    pointCollision(float x,float y){
        this.x = x;
        this.y = y;
        this.exists = true;
    }
    pointCollision(boolean exists){
        this.exists = exists;
    }
}
