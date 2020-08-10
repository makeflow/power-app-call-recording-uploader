package com.phonecallrecorduploader;

import java.util.Date;

@FunctionalInterface
public interface PhoneCallListener {
  void onChange(int state, String number, Date time);
}
