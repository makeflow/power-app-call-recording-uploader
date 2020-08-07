package com.phonecallrecorduploader;

import android.os.Bundle;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class ComModule extends ReactContextBaseJavaModule {

  private NewRecordFileWatcher newRecordFileWatcher = NewRecordFileWatcher.getInstance();
  private ReactContext reactContext;

  public ComModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.newRecordFileWatcher.setListener(this::sendNewRecordFileEvent);
  }

  @NonNull
  @Override
  public String getName() {
    return "ComModule";
  }

  @ReactMethod
  public void setRecordFolderPath(String path) {
    this.newRecordFileWatcher.setRecordFileFolder(path);
  }

  private void sendEvent(String event, @Nullable WritableMap params) {
    this.reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(event, params);
  }

  private void sendNewRecordFileEvent(Bundle fileInfo) {
    this.sendEvent(NewRecordFile, Arguments.fromBundle(fileInfo));
  }

  public static final String NewRecordFile = "NewRecordFile";
}
