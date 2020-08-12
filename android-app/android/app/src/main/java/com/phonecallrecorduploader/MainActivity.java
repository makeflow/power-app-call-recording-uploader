package com.phonecallrecorduploader;

import android.Manifest;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.phonecallrecorduploader.di.DaggerAppComponent;
import com.phonecallrecorduploader.di.DaggerMainComponent;

import static com.phonecallrecorduploader.PhoneCallReceiver.OUTGOING_CALL_ENDED;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

public class MainActivity extends ReactActivity {

  private static final int PERMISSION_REQUEST_CODE = 0;

  @Inject
  public PhoneCallReceiver phoneCallReceiver;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "PhoneCallRecordUploader";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.initInjection();

    this.requestPermissionsNeeded();
    this.startAutoUploadRecordService();
    this.registerPhoneCallReceiver();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();

    this.stopAutoUploadRecordService();
    this.unregisterPhoneCallReceiver();
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    if (requestCode != PERMISSION_REQUEST_CODE) {
      return;
    }

    for (int result : grantResults) {
      if (result != PackageManager.PERMISSION_GRANTED) {
        Log.d("PERMISSION", "need permission: " + Arrays.toString(permissions));
        this.finishAndRemoveTask();
      }
    }
  }

  private void initInjection() {
    DaggerMainComponent
      .builder()
      .appComponent(((MainApplication) this.getApplication()).getAppComponent())
      .build()
      .inject(this);
  }

  private void startAutoUploadRecordService() {
    Intent service = new Intent(this, AutoUploadRecordService.class);
    ContextCompat.startForegroundService(this, service);
  }

  private void stopAutoUploadRecordService() {
    this.stopService(new Intent(this, AutoUploadRecordService.class));
  }

  private void requestPermissionsNeeded() {
    List<String> permissionsToBeRequested = new ArrayList<>(8);

    if (this.hasNoPermission(Manifest.permission.READ_PHONE_STATE)) {
      permissionsToBeRequested.add(Manifest.permission.READ_PHONE_STATE);
    }

    if (this.hasNoPermission(Manifest.permission.PROCESS_OUTGOING_CALLS)) {
      permissionsToBeRequested.add(Manifest.permission.PROCESS_OUTGOING_CALLS);
    }

    if (this.hasNoPermission(Manifest.permission.CAMERA)) {
      permissionsToBeRequested.add(Manifest.permission.CAMERA);
    }

    if (this.hasNoPermission(Manifest.permission.READ_EXTERNAL_STORAGE)) {
      permissionsToBeRequested.add(Manifest.permission.READ_EXTERNAL_STORAGE);
    }

    this.requestPermissions(permissionsToBeRequested);
  }

  private void registerPhoneCallReceiver() {
    IntentFilter intentFilter = new IntentFilter();
    intentFilter.addAction("android.intent.action.PHONE_STATE");
    intentFilter.addAction("android.intent.action.NEW_OUTGOING_CALL");

    this.registerReceiver(this.phoneCallReceiver, intentFilter);

    Log.d("MainActivity", "phoneCallReceiver: " + this.phoneCallReceiver);
  }

  private void unregisterPhoneCallReceiver() {
    this.unregisterReceiver(this.phoneCallReceiver);
  }

  private boolean hasNoPermission(String permission) {
    int permissionState = ContextCompat.checkSelfPermission(MainActivity.this, permission);
    return permissionState != PackageManager.PERMISSION_GRANTED;
  }

  private void requestPermissions(List<String> permissionList) {
    if (null == permissionList || permissionList.size() == 0) {
      return;
    }

    String[] permissions = new String[permissionList.size()];
    permissionList.toArray(permissions);

    ActivityCompat.requestPermissions(
      MainActivity.this,
      permissions,
      PERMISSION_REQUEST_CODE
    );
  }
}
