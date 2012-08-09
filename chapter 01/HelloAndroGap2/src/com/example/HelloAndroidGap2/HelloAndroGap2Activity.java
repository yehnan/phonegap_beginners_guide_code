package com.example.HelloAndroidGap2;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;

public class HelloAndroGap2Activity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.main);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}