package com.example.raycastio;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

import processing.core.PApplet;
import processing.core.PImage;
import processing.core.PVector;

public class Sketch extends PApplet{

    static URI uri = URI.create("https://Raycastio.mchrisgm.repl.co");
    static IO.Options options = IO.Options.builder().build();

    static Socket socket = IO.socket(uri, options);

    String pID;
    boolean connected = false;

    Player player;

    float aspect;
    String lobby;
    ArrayList<Object[][]> playerInfo;

    boolean moving = true;
    boolean paused = false;

    float fov = 60;
    float lineWidth;
    int res = 2;

    float[][] walls = Walls.walls;

    float sensX = 0.05f;
    float yAxis;

    PImage wallTex;

    static float scale;

    public void settings() {
        fullScreen();
    }

    public void setup() {
        wallTex = loadImage("brickwall2.png");
        orientation(LANDSCAPE);
//        orientation(PORTRAIT);

        stroke(0);
        fill(0);
        background(255);

        socketFunctions();

        socket.connect();

        setSize(false);

        socket.emit("username",MainActivity.username);

        JSONObject data = new JSONObject();
        switch(MainActivity.lobbyMode){
            case 1:
                socket.emit("joinRandom");

                try {
                    data.put("name", "");
                    data.put("message", player.getUname()+" connected!");
                    data.put("time", "");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                socket.emit("sendMessage", data);
                break;
            case 2:
                socket.emit("createCustom");
                try {
                    data.put("name", "");
                    data.put("message", player.getUname()+" connected!");
                    data.put("time", "");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                socket.emit("sendMessage", data);
                break;
            case 3:
                socket.emit("joinCustom", MainActivity.customLobbyCode);
                try {
                    data.put("name", "");
                    data.put("message", player.getUname()+" connected!");
                    data.put("time", "");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                socket.emit("sendMessage", data);
                break;
            default:
                break;
        }

        frameRate(60);

    }

    public void socketFunctions(){
        socket.on(Socket.EVENT_CONNECT,onConnect);

        socket.on("setPlayerId", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                pID = Double.toString((Double) args[0]);
                System.out.println("Player ID: "+pID);
            }
        });

        socket.on("joinLobby", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                lobby = (String) args[0];
                System.out.println("Lobby: "+lobby);
                socket.emit("lobbyInfo");
            }
        });

        socket.on("lobbyInfo", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                try {
                    JSONObject data = new JSONObject(args[0].toString());
                    PlayersList.otherP = new ArrayList<Player>();
                    JSONArray ids = data.optJSONArray("ids");
                    JSONArray names = data.optJSONArray("names");
                    JSONArray positions = data.optJSONArray("positions");

                    for(int i=0; i < ids.length(); i++){
                        if(Double.toString(ids.optDouble(i)) != pID){
                            float x = (float) positions.optJSONObject(i).optDouble("x");
                            float y = (float) positions.optJSONObject(i).optDouble("y");
                            String id = Double.toString(ids.optDouble(i));
                            String uname = names.optString(i);
                            PlayersList.otherP.add(new Player(x, y,id, uname));
                        }else{
                            player.setUname(names.optString(i));
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });



    }

    int font = 36;
    public void draw() {

        if (lobby != null && lobby != "") {

            background(51);

            text("Hi",width/2,height/2);

            System.out.println("Drawing");

            try {
                main();
            } catch (JSONException e) {e.printStackTrace();}

        }else{

            System.out.println("Lobby");

            background(82);
            pushMatrix();
            translate(width/2,font/2);
            stroke(255);
            textSize(font);
            textAlign(CENTER);
            fill(0);
            text("Connection Status: ",0,font/2);

            if(connected){fill(0,255,0);
            }else{fill(255,0,0);}
            noStroke();
            ellipse("Connection Status: ".length()*font/4 , font/2-10,20*font/20,20*font/20);
            popMatrix();
        }


    }

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    connected = true;
                }
            });
        }
    };

    public void setSize(boolean resizing){
        float pScale = 0;
        PVector pPos =  new PVector();
        if(resizing){
            pScale = scale;
            pPos = player.getPos();
        }
        scale = height/500;
        lineWidth = 1+ width / (fov * res);
        player = new Player(150*scale, 150* scale, pID, MainActivity.username);
        if (resizing){
            float x = (pPos.x / pScale) * scale;
            float y = (pPos.y / pScale) * scale;
            player.setPos(x,y);
        }
        yAxis = height/2;
        formatScale();
    }

    public void formatScale(){
        for (int i = 0; i < walls.length; i++) {
            for (int j = 0; j < walls[i].length - 1; j++) {
                walls[i][j] *= scale;
            }
        }
    }

    public void main() throws JSONException {

        raycast();

        JSONObject data = new JSONObject();
        data.put("x", player.getPos().x / scale);
        data.put("y", player.getPos().x / scale);

        socket.emit("updatePosition", data);
        socket.emit("lobbyInfo");

    }

    public void raycast() throws JSONException {

        background(107, 211, 255);

        ArrayList<Ray> rays = new ArrayList<Ray>();

//        playerSpeed();
//        playerMovement();
//        playerDirection();

        player.checkCollision();

        float x = player.getPos().x;
        float y = player.getPos().y;
        double dir = player.getDir();

        fill(121, 212, 91);
        rect(0, yAxis, width, 3 * height);

        lineCollision surface = new lineCollision(
                new PVector(),
                new PVector()
        );

        Map players = new HashMap<String, Object[]>();

        for (float i = (float) (dir - fov / 2); i < dir + fov / 2; i += 1 / (float) res) {

            Ray ray = new Ray(x, y, i);
//
            ArrayList<Object[]> rayDistances = ray.getDist();
//
            Collections.reverse(rayDistances);
//
            for (Object[] distance : rayDistances) {
//
                ray.setLength((float) distance[0] * cos((float) ((i - dir) * Math.PI / 180)));
                float rayDist = ray.getLength();

                pushMatrix();
                translate(0, yAxis);
                String username = "";
                if (rayDist > 0) {
                    float colX = map((float) (i - dir), -fov / 2, fov / 2, 0, width);
                    JSONObject colFilling = new JSONObject();

                    if ((String) distance[2] == "player") {
                        int[] color = Functions.hsvToRgb(200f, 100f, map(rayDist, 0, 800, 100, 50));

                        try {
                            colFilling.put("type", "color");
                            colFilling.put("r", color[0]);
                            colFilling.put("g", color[1]);
                            colFilling.put("b", color[2]);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        if (!(players.containsKey(distance[4]))) {
                            players.put(distance[4], new Object[]{colX, colX, rayDist, distance[3]});
                        } else {
                            float firstColX = (float) ((Object[]) (players.get(distance[4])))[0];
                            players.replace(distance[4], new Object[]{firstColX, colX, rayDist, distance[3]});
                        }

                    } else {
                        float wallLeft, wallRight;
                        float contactCoord;
                        if (((pointCollision) distance[4]).x == ((pointCollision) distance[5]).x) {
                            wallLeft = ((pointCollision) distance[4]).y;
                            wallRight = ((pointCollision) distance[5]).y;
                            contactCoord = ((pointCollision) distance[3]).y;
                        } else {
                            wallLeft = ((pointCollision) distance[4]).x;
                            wallRight = ((pointCollision) distance[5]).x;
                            contactCoord = ((pointCollision) distance[3]).x;
                        }

                        try {
                            colFilling.put("type", "tex");
                            colFilling.put("tex", wallTex);

                            float XonTex = floor(map(contactCoord, wallLeft, wallRight, 0, abs(wallRight - wallLeft)) / (2 / 3)) % ((PImage) colFilling.get("tex")).width;

                            colFilling.put("xOnTex", XonTex);


                        } catch (JSONException e) {
                            e.printStackTrace();
                        }


                    }

                    float colWidth = lineWidth;
                    float colBottom = (30 * height * scale) / (2 * rayDist);
                    float colHeight = colBottom * 2 * (float) (distance[1]);
                    float colTop = colBottom - colHeight;

                    if (colFilling.getString("type") == "color") {
                        strokeWeight(0);
                        fill(colFilling.getInt("r"), colFilling.getInt("g"), colFilling.getInt("b"));
                        rect(colX, colTop, colWidth, colHeight);
                    } else if (colFilling.getString("type") == "tex") {

                        image(((PImage) colFilling.get("tex")),
                                colX, colTop, colWidth, colHeight,
                                (int) colFilling.getDouble("xOnTex"),
                                0, 1, ((PImage) colFilling.get("tex")).height);

                    }
                    strokeWeight(0);
                    fill(0, 0, 0, map((float) distance[0], 0, 800, 0, 100));
                    rect(colX, colTop, colWidth, colHeight);

                    if ((float) distance[1] != 0 && (float) distance[1] < 0.5) {
                        if (surface.p1.y != 0.0f && surface.p1.x == (float) distance[1]) {
                            surface.p2.y = colTop;
                        } else {
                            surface.p1.y = colTop;
                            surface.p1.x = (float) distance[1];
                        }
                    }
                    if (surface.p1.y != 0.0f && surface.p2.y != 0.0f) {
                        strokeWeight(0);
                        fill(175, 78, 41); // color of the top of the wall
                        rect(colX, surface.p1.y, colWidth, surface.p2.y - surface.p1.y);
                        surface = new lineCollision(
                                new PVector(),
                                new PVector()
                        );
                    }
                }
                popMatrix();
            }

        displayNames(players);

        //Show crosshair
        fill(0, 255, 0);
        stroke(0);
        strokeWeight(1);
        ellipse(width / 2, height / 2, 5, 5);

        }
    }

    private void displayNames(Map players) {
        textAlign(CENTER);
        strokeWeight(4);
        stroke(0);
        fill(255);

        pushMatrix();
        translate(0, yAxis);

        System.out.println(players.toString());

        Iterator<Map.Entry<String,Object[]>> entries = players.entrySet().iterator();

        while (entries.hasNext()) {
            Map.Entry<String,Object[]> entry = entries.next();
//            System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());

            Object[] colXs = entry.getValue();

            float colX = ((float)colXs[0] + (float)colXs[1]) / 2;
            textSize((8000 * scale) / (float)colXs[2]);
            text(colXs[3].toString(), colX, -20);
        }

        popMatrix();
    }
}