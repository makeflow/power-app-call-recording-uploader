package com.phonecallrecorduploader.di;

import com.phonecallrecorduploader.MainActivity;
import com.phonecallrecorduploader.ReactNativeModule;

import dagger.Component;

@GlobalScoped
@Component(dependencies = AppComponent.class)
public interface MainComponent {
  void inject(MainActivity mainActivity);
  void inject(ReactNativeModule reactNativeModule);
}
