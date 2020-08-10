import {EmitterSubscription} from 'react-native';

interface ReactNativeModule {
  setRecordFolderPath(path: string): void;
}

export interface RecordFile {
  number: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mtime: number;
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
  }
}
