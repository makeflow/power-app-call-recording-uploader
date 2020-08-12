package com.phonecallrecorduploader;

import android.os.Bundle;
import android.os.FileObserver;
import android.util.Log;

import java.io.File;
import java.util.Date;

import javax.annotation.Nullable;

import static com.phonecallrecorduploader.PhoneCallReceiver.*;

public class RecordFileWatcher {

  public PhoneCallReceiver phoneCallReceiver;

  private FileObserver fileObserver;
  private RecordFileListener listener;
  private String folderPath;
  private String currentRecordFilePath;
  private String currentNumber;
  private boolean calling = false;
  private boolean currentRecordFileWriting = false;

  public RecordFileWatcher(PhoneCallReceiver phoneCallReceiver) {
    this.phoneCallReceiver = phoneCallReceiver;
    Log.d("RecordFileWatcher", "phoneCallReceiver: " + phoneCallReceiver);
    this.phoneCallReceiver.addListener(this::handleOutgoingCall);
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

        String folderPath = RecordFileWatcher.this.folderPath;
        File file = new File(folderPath, path);

        if (file.isDirectory() || file.isHidden()) {
          return;
        }

        if (FileObserver.CREATE == event) {
          RecordFileWatcher.this.currentRecordFileWriting = true;
        } else if (FileObserver.CLOSE_WRITE == event) {
          RecordFileWatcher.this.currentRecordFileWriting = false;
          RecordFileWatcher.this.currentRecordFilePath = file.getPath();
          RecordFileWatcher.this.tryDispatchNewRecordFileEvent();
        }
      }
    };
  }

  private void handleOutgoingCall(int state, String number, Date time) {
    String path = this.currentRecordFilePath;

    Log.d("RecordFileWatcher", "state: " + state + ", path: " + path);

    this.currentNumber = number;

    if (OUTGOING_CALL_STARTED == state) {
      this.calling = true;
    } else if (OUTGOING_CALL_ENDED == state) {
      this.calling = false;
      this.tryDispatchNewRecordFileEvent();
    }
  }

  private void resetCallState() {
    this.calling = false;
    this.currentRecordFileWriting = false;
    this.currentNumber = null;
    this.currentRecordFilePath = null;
  }

  private boolean isRecordEnded() {
    return !this.calling
      && !this.currentRecordFileWriting
      && null != this.currentRecordFilePath
      && null != this.currentNumber;
  }

  private void dispatchNewRecordFileEvent() {
    Bundle fileInfo = RecordFileWatcher.createRecordFileInfo(
      this.currentRecordFilePath,
      this.currentNumber
    );

    this.listener.getNewRecordFileInfo(fileInfo);
  }

  private void tryDispatchNewRecordFileEvent() {
    if (this.isRecordEnded()) {
      if (null != this.listener) {
        this.dispatchNewRecordFileEvent();
      }
      this.resetCallState();
    }
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
