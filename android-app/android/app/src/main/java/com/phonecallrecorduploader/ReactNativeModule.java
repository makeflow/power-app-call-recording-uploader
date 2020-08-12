package com.phonecallrecorduploader;

import android.content.Context;
import android.content.Intent;
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

import static com.phonecallrecorduploader.PhoneCallReceiver.*;

import java.util.Date;

import javax.annotation.Nullable;
import javax.inject.Inject;

public class ReactNativeModule extends ReactContextBaseJavaModule {

  @Inject
  public RecordFileWatcher recordFileWatcher;

  @Inject
  public PhoneCallReceiver phoneCallReceiver;

  private ReactContext reactContext;

  public ReactNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);

    this.reactContext = reactContext;
    this.initInjection();
    this.recordFileWatcher.setListener(this::sendNewRecordFileEvent);
    this.phoneCallReceiver.addListener(this::sendOutgoingPhoneCallEvent);
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

  @ReactMethod
  public void bringActivityToFront() {
    Context context = this.reactContext;

    if (null == context) {
      return;
    }

    Intent mainActivity = new Intent(context.getApplicationContext(), MainActivity.class);
    mainActivity.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    context.startActivity(mainActivity);
  }

  private void sendEvent(String event, @Nullable WritableMap params) {
    this.reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(event, params);
  }

  private void sendNewRecordFileEvent(Bundle fileInfo) {
    this.sendEvent(EVENT_NEW_RECORD_FILE, Arguments.fromBundle(fileInfo));
  }

  private void sendOutgoingPhoneCallEvent(int state, String number, Date time) {
    Bundle args = new Bundle();

    if (OUTGOING_CALL_ENDED == state) {
      args.putString("number", number);

      this.sendEvent(EVENT_OUTGOING_PHONE_CALL_ENDED, Arguments.fromBundle(args));
    }
  }

  public static final String EVENT_NEW_RECORD_FILE = "NewRecordFile";
  public static final String EVENT_OUTGOING_PHONE_CALL_ENDED = "OutgoingPhoneCallEnded";
}
