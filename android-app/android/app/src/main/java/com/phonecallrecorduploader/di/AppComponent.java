package com.phonecallrecorduploader.di;

import com.phonecallrecorduploader.PhoneCallReceiver;
import com.phonecallrecorduploader.RecordFileWatcher;

import javax.inject.Singleton;

import dagger.Component;

@Singleton
@Component(modules = {AppModule.class})
public interface AppComponent {
  PhoneCallReceiver providePhoneCallReceiver();
  RecordFileWatcher provideRecordFileWatcher();
}
