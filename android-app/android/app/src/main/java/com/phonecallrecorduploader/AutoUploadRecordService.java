package com.phonecallrecorduploader;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import static com.phonecallrecorduploader.MainApplication.CHANNEL_ID;

public class AutoUploadRecordService extends Service {

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    Intent notificationIntent = new Intent(this, MainActivity.class);
    PendingIntent pendingIntent = PendingIntent.getActivity(
      this, 0, notificationIntent, 0);
    Bitmap notificationLargeIcon = BitmapFactory.decodeResource(this.getResources(), R.mipmap.ic_launcher);
    Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("通话录音上传")
      .setContentText("自动上传通话录音服务运行中...")
      .setContentIntent(pendingIntent)
      .setSmallIcon(R.mipmap.ic_launcher)
      .setLargeIcon(notificationLargeIcon)
      .build();
    this.startForeground(1, notification);
    return START_NOT_STICKY;
  }

  @Nullable
  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }
}
