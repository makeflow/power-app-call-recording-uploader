import {GlobalState} from '@/store';
import {DeviceEventEmitter, NativeModules} from 'react-native';

DeviceEventEmitter.addListener('OutgoingPhoneCallEnded', (phoneCallInfo) => {
  const endedNumber = phoneCallInfo.number;
  const currentNumber = GlobalState.getPhoneCallInfo().phone;

  if (currentNumber === endedNumber) {
    NativeModules.ReactNativeModule.bringActivityToFront();
  }
});
