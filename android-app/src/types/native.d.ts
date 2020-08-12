import {EmitterSubscription} from 'react-native';

interface ReactNativeModule {
  setRecordFolderPath(path: string): void;

  bringActivityToFront(): void;
}

export interface RecordFile {
  number: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mtime: number;
}

export interface PhoneCallInfo {
  number: string;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    ReactNativeModule: ReactNativeModule;
  }

  interface DeviceEventEmitterStatic {
    addListener(
      event: 'NewRecordFile',
      handler: (fileInfo: RecordFile) => void,
    ): EmitterSubscription;

    addListener(
      event: 'OutgoingPhoneCallEnded',
      handler: (phoneCallInfo: PhoneCallInfo) => void,
    ): EmitterSubscription;
  }
}
