package com.example.raycastio;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentActivity;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Bundle;

import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;

import org.apache.commons.text.StringEscapeUtils;

import processing.android.PFragment;
import processing.android.CompatUtils;
import processing.core.PApplet;

public class MainActivity extends FragmentActivity  {
    private PApplet sketch;

    public static String username;
    public static int lobbyMode;
    public static String customLobbyCode;

    private EditText usernameField;
    private Button playButton;

    private Button createLobby;
    private Button randomLobby;
    private EditText lobbyCode;
    private Button customLobby;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout frame = new FrameLayout(this);
        frame.setId(CompatUtils.getUniqueViewId());

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        usernameField = (EditText) findViewById(R.id.usernameField);
        playButton = (Button) findViewById(R.id.playButton);

        FragmentActivity activity = this;

        playButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Code here executes on main thread after user presses button
                username = StringEscapeUtils.escapeJava(usernameField.getText().toString());

                if(username != null && username.length() <= 20) {
                    setContentView(R.layout.lobby_main);
                    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

                    createLobby = (Button) findViewById(R.id.createLobbyBtn);
                    randomLobby = (Button) findViewById(R.id.randomLobbyBtn);
                    lobbyCode = (EditText) findViewById(R.id.customLobbyText);
                    customLobby = (Button) findViewById(R.id.customLobbyBtn);

                    createLobby.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            // Code here executes on main thread after user presses button
                            username = StringEscapeUtils.escapeJava(usernameField.getText().toString());
                            lobbyMode = 2;
                            if(username != null && username.length() <= 20) {
                                setContentView(frame, new ViewGroup.LayoutParams(
                                        ViewGroup.LayoutParams.MATCH_PARENT,
                                        ViewGroup.LayoutParams.MATCH_PARENT));
                                sketch = new Sketch();
                                PFragment fragment = new PFragment(sketch);
                                fragment.setView(frame, activity);

                            }

                        }
                    });
                    randomLobby.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            // Code here executes on main thread after user presses button
                            username = StringEscapeUtils.escapeJava(usernameField.getText().toString());
                            lobbyMode = 1;
                            if(username != null && username.length() <= 20) {
                                setContentView(frame, new ViewGroup.LayoutParams(
                                        ViewGroup.LayoutParams.MATCH_PARENT,
                                        ViewGroup.LayoutParams.MATCH_PARENT));
                                sketch = new Sketch();
                                PFragment fragment = new PFragment(sketch);
                                fragment.setView(frame, activity);


                            }

                        }
                    });
                    customLobby.setOnClickListener(new View.OnClickListener() {
                        public void onClick(View v) {
                            // Code here executes on main thread after user presses button
                            username = StringEscapeUtils.escapeJava(usernameField.getText().toString());
                            lobbyMode = 3;
                            customLobbyCode = StringEscapeUtils.escapeJava(lobbyCode.getText().toString());
                            if(username != null && username.length() <= 20 && customLobbyCode.length() == 5) {
                                setContentView(frame, new ViewGroup.LayoutParams(
                                        ViewGroup.LayoutParams.MATCH_PARENT,
                                        ViewGroup.LayoutParams.MATCH_PARENT));
                                sketch = new Sketch();
                                PFragment fragment = new PFragment(sketch);
                                fragment.setView(frame, activity);

                            }

                        }
                    });

                }

            }
        });








    }

    @Override
    public void onBackPressed()
    {
        // Instead of setcontentview() i am restarting the activity.
        Sketch.socket.disconnect();
        Intent i = new Intent(getApplicationContext(),MainActivity.class);
        startActivity(i);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
        if (sketch != null) {
            sketch.onRequestPermissionsResult(
                    requestCode, permissions, grantResults);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        if (sketch != null) {
            sketch.onNewIntent(intent);
        }
    }
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    private void hideSystemUI() {
        // Enables regular immersive mode.
        // For "lean back" mode, remove SYSTEM_UI_FLAG_IMMERSIVE.
        // Or for "sticky immersive," replace it with SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE
                        // Set the content to appear under the system bars so that the
                        // content doesn't resize when the system bars hide and show.
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        // Hide the nav bar and status bar
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN);
    }

    // Shows the system bars by removing all the flags
// except for the ones that make the content appear under the system bars.
    private void showSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }
}