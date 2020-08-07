import {EmitterSubscription} from 'react-native';

interface ComModule {
  setRecordFolderPath(path: string): void;
}

export interface RecordFile {
  path: string;
  name: string;
  type: string;
  size: number;
  mtime: number;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    ComModule: ComModule;
  }

  interface DeviceEventEmitterStatic {
    addListener(
      event: 'NewRecordFile',
      handler: (fileInfo: RecordFile) => void,
    ): EmitterSubscription;
  }
}
