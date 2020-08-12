import {uploadFiles} from '@/api';
import {File} from '@/models';
import {GlobalState} from '@/store';
import {RecordFile} from '@/types/native';
import {Alert, DeviceEventEmitter, NativeModules} from 'react-native';

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

  upload(file);
}

DeviceEventEmitter.addListener('NewRecordFile', handleNewRecordFileEvent);

function upload(file: File): void {
  GlobalState.setFileUploading(file);

  uploadFiles([file])
    .start()
    .then(() => GlobalState.setFileUploaded(file))
    .catch(() => {
      GlobalState.setFileUploadFailed(file);
      Alert.alert(
        '上传失败',
        '上传失败，可能是网络或者其他问题，请重试或联系管理员',
        [
          {text: '取消'},
          {
            text: '重试',
            onPress: () => upload(file),
          },
        ],
      );
    });
}
