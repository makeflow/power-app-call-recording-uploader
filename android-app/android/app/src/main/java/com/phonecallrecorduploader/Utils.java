package com.phonecallrecorduploader;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class Utils {
  public static String getFileMimeType(File file) {
    try {
      return Files.probeContentType(file.toPath());
    } catch (IOException e) {
      return "";
    }
  }
}
