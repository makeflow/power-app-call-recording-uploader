import {uploadFile} from '@/api';
import {File, RecordFile} from '@/models';
import {GlobalState} from '@/store';

export function handleNewRecordFileEvent(fileInfo: RecordFile): void {
  if (!GlobalState.isInPhoneCallProcess()) {
    return;
  }

  const file = File.fromRecordFile(fileInfo);
  GlobalState.addFile(file);
  const currentPhoneCallInfo = GlobalState.getPhoneCallInfo();

  if (!file.name.includes(currentPhoneCallInfo.phone)) {
    return;
  }

  GlobalState.setFileUploading(file);
  uploadFile([file])
    .start()
    .then(() => GlobalState.setFileUploaded(file))
    .catch(() => GlobalState.setFileUploadFailed(file));
}
