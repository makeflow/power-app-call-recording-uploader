package com.phonecallrecorduploader;

import android.os.Bundle;

@FunctionalInterface
public interface RecordFileListener {
  void getNewRecordFileInfo(Bundle fileInfo);
}
