package com.phonecallrecorduploader;

import android.os.Bundle;
import android.os.FileObserver;

import java.io.File;

import javax.annotation.Nullable;

public class NewRecordFileWatcher {
  private FileObserver fileObserver;
  private NewRecordFileListener listener;

  private NewRecordFileWatcher() {
  }

  public void setRecordFileFolder(String path) {
    this.stop();
    this.start(path);
  }

  public void start(String folderPath) {
    this.fileObserver = new FileObserver(folderPath, FileObserver.CLOSE_WRITE) {
      @Override
      public void onEvent(int event, @Nullable String path) {
        if (null == path) {
          return;
        }
        File file = new File(folderPath, path);
        if (file.isDirectory() || file.isHidden()) {
          return;
        }
        NewRecordFileListener listener = NewRecordFileWatcher.this.listener;
        if (null == listener) {
          return;
        }
        listener.getNewRecordFileInfo(NewRecordFileWatcher.createFileInfo(file));
      }
    };

    this.fileObserver.startWatching();
  }

  public void setListener(NewRecordFileListener listener) {
    this.listener = listener;
  }

  public void stop() {
    if (null != this.fileObserver) {
      this.fileObserver.stopWatching();
    }
  }

  private static Bundle createFileInfo(File file) {
    Bundle info = new Bundle();
    info.putString("path", file.getPath());
    info.putString("name", file.getName());
    info.putString("type", Utils.getFileMimeType(file));
    info.putLong("mtime", file.lastModified());
    info.putLong("size", file.length());
    return info;
  }

  private static class StaticSingletonHolder {
    private static final NewRecordFileWatcher instance = new NewRecordFileWatcher();
  }

  public static NewRecordFileWatcher getInstance() {
    return StaticSingletonHolder.instance;
  }
}
