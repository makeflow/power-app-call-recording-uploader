package com.phonecallrecorduploader;

import android.os.Bundle;

@FunctionalInterface
public interface NewRecordFileListener {
  void getNewRecordFileInfo(Bundle fileInfo);
}
