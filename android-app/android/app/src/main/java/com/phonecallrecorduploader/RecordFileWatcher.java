package com.phonecallrecorduploader;

import android.os.Bundle;
import android.os.FileObserver;
import android.util.Log;

import java.io.File;
import java.util.Date;

import javax.annotation.Nullable;

import static com.phonecallrecorduploader.PhoneCallReceiver.OUTGOING_CALL_ENDED;

public class RecordFileWatcher {

  public PhoneCallReceiver phoneCallReceiver;

  private FileObserver fileObserver;
  private RecordFileListener listener;
  private String folderPath;
  private String currentRecordFilePath;

  public RecordFileWatcher(PhoneCallReceiver phoneCallReceiver) {
    this.phoneCallReceiver = phoneCallReceiver;
    Log.d("RecordFileWatcher", "phoneCallReceiver: " + phoneCallReceiver);
    this.phoneCallReceiver.addListener(this::handleOutgoingCallEnded);
  }

  public void setRecordFileFolder(String path) {
    Log.d("RecordFileWatcher", "set folder: " + path);

    this.folderPath = path;
    this.stop();
    this.start();
  }

  public void start() {
    if (null != this.fileObserver) {
      this.stop();
    }

    this.fileObserver = this.createFileObserver();
    this.fileObserver.startWatching();
  }

  public void setListener(RecordFileListener listener) {
    this.listener = listener;
  }

  public void stop() {
    if (null != this.fileObserver) {
      this.fileObserver.stopWatching();
    }
  }

  private FileObserver createFileObserver() {
    return new FileObserver(this.folderPath, FileObserver.ALL_EVENTS) {
      @Override
      public void onEvent(int event, @Nullable String path) {
        if (null == path) {
          return;
        }

        if (FileObserver.CREATE != event && FileObserver.CLOSE_WRITE != event) {
          return;
        }

        File file = new File(folderPath, path);

        if (file.isDirectory() || file.isHidden()) {
          return;
        }

        RecordFileWatcher.this.currentRecordFilePath = file.getPath();
      }
    };
  }

  private void handleOutgoingCallEnded(int state, String number, Date time) {
    String path = this.currentRecordFilePath;

    Log.d("RecordFileWatcher", "state: " + state + ", path: " + path);

    if (
      OUTGOING_CALL_ENDED == state
        && null != path
        && null != this.listener
    ) {
      Bundle fileInfo = RecordFileWatcher.createRecordFileInfo(path, number);
      this.listener.getNewRecordFileInfo(fileInfo);
    }

    this.currentRecordFilePath = null;
  }

  private static Bundle createRecordFileInfo(String path, String number) {
    File file = new File(path);
    Bundle info = new Bundle();

    info.putString("number", number);
    info.putString("path", path);
    info.putString("name", file.getName());
    info.putString("type", Utils.getFileMimeType(file));
    info.putLong("mtime", file.lastModified());
    info.putLong("size", file.length());

    Log.d("RecordFileWatcher", info.toString());

    return info;
  }
}
