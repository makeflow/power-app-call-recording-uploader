package com.phonecallrecorduploader.di;

import com.phonecallrecorduploader.PhoneCallReceiver;
import com.phonecallrecorduploader.RecordFileWatcher;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module
public class AppModule {

  @Singleton
  @Provides
  RecordFileWatcher provideRecordFileWatcher(PhoneCallReceiver phoneCallReceiver) {
    return new RecordFileWatcher(phoneCallReceiver);
  }

  @Singleton
  @Provides
  PhoneCallReceiver providePhoneCallReceiver() {
    return new PhoneCallReceiver();
  }
}
