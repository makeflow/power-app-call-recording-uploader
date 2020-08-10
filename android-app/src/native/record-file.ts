import {uploadFile} from '@/api';
import {File} from '@/models';
import {GlobalState} from '@/store';
import {RecordFile} from '@/types/native';
import {DeviceEventEmitter, NativeModules} from 'react-native';

const ReactNativeModule = NativeModules.ReactNativeModule;

export const setRecordFileFolder = ReactNativeModule.setRecordFolderPath;

function handleNewRecordFileEvent(recordFileInfo: RecordFile): void {
  if (!GlobalState.isInPhoneCallProcess()) {
    return;
  }

  const file = File.fromRecordFile(recordFileInfo);
  GlobalState.addFile(file);

  const phoneCallInfo = GlobalState.getPhoneCallInfo();

  if (recordFileInfo.number !== phoneCallInfo.phone) {
    return;
  }

  GlobalState.setFileUploading(file);
  uploadFile([file])
    .start()
    .then(() => GlobalState.setFileUploaded(file))
    .catch(() => GlobalState.setFileUploadFailed(file));
}

DeviceEventEmitter.addListener('NewRecordFile', handleNewRecordFileEvent);
