package com.phonecallrecorduploader;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class MainActivity extends ReactActivity {

  private static final int PERMISSION_REQUEST_CODE = 0;

  private PhoneCallReceiver phoneCallReceiver;

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

    if (null == this.phoneCallReceiver) {
      this.phoneCallReceiver = new PhoneCallReceiver();
    }

    this.registerReceiver(this.phoneCallReceiver, intentFilter);
  }

  private void unregisterPhoneCallReceiver() {
    if (null != this.phoneCallReceiver) {
      this.unregisterReceiver(this.phoneCallReceiver);
    }
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

  private void bringActivityToFront() {
    Intent self = new Intent(this.getApplicationContext(), MainActivity.class);
    self.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
    this.startActivity(self);
  }

  private class PhoneCallReceiver extends PhoneCallReceiverBase {

    @Override
    protected void onOutgoingCallStarted(Context ctx, String number, Date time) {
      Log.d("PhoneCallReceiver", "outgoing call started: " + number + " " + time);
    }

    @Override
    protected void onOutgoingCallEnded(Context ctx, String number, Date start, Date time) {
      Log.d("PhoneCallReceiver", "outgoing call ended: " + number + " " + time);

      MainActivity.this.bringActivityToFront();
    }
  }
}
