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
import com.phonecallrecorduploader.di.DaggerMainComponent;

import javax.annotation.Nullable;
import javax.inject.Inject;

public class ReactNativeModule extends ReactContextBaseJavaModule {

  @Inject
  public RecordFileWatcher recordFileWatcher;

  private ReactContext reactContext;

  public ReactNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    this.reactContext = reactContext;
    this.initInjection();
    this.recordFileWatcher.setListener(this::sendNewRecordFileEvent);
  }

  private void initInjection() {
    MainApplication mainApplication = (MainApplication) this.reactContext.getApplicationContext();

    DaggerMainComponent
      .builder()
      .appComponent(mainApplication.getAppComponent())
      .build()
      .inject(this);
  }

  @NonNull
  @Override
  public String getName() {
    return "ReactNativeModule";
  }

  @ReactMethod
  public void setRecordFolderPath(String path) {
    this.recordFileWatcher.setRecordFileFolder(path);
  }

  private void sendEvent(String event, @Nullable WritableMap params) {
    this.reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(event, params);
  }

  private void sendNewRecordFileEvent(Bundle fileInfo) {
    this.sendEvent(EVENT_NEW_RECORD_FILE, Arguments.fromBundle(fileInfo));
  }

  public static final String EVENT_NEW_RECORD_FILE = "NewRecordFile";
}
