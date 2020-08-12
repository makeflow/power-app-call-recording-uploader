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

  const phoneCallInfo = GlobalState.getPhoneCallInfo();
  const file = File.fromRecordFile(recordFileInfo);

  if (recordFileInfo.number !== phoneCallInfo.phone) {
    return;
  }

  GlobalState.addFile(file);
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
