import {uploadFile} from '@/api';
import {File} from '@/models';
import {GlobalState} from '@/store';
import {RecordFile} from '@/types/native';

export function handleNewRecordFileEvent(fileInfo: RecordFile): void {
  if (!GlobalState.isInPhoneCallProcess()) {
    return;
  }

  const file = File.fromRecordFile(fileInfo);
  GlobalState.addFile(file);

  if (!isRecordFileMatchCurrentPhoneCall(file)) {
    return;
  }

  GlobalState.setFileUploading(file);
  uploadFile([file])
    .start()
    .then(() => GlobalState.setFileUploaded(file))
    .catch(() => GlobalState.setFileUploadFailed(file));
}

function removeNonNumericChars(str: string): string {
  let result = '';
  const len = str.length;

  for (let i = 0; i < len; i++) {
    const charCode = str.charCodeAt(i);

    if (48 <= charCode && charCode <= 57) {
      result += str[i];
    }
  }

  return result;
}

function isRecordFileMatchCurrentPhoneCall(file: File): boolean {
  const currentPhoneCallInfo = GlobalState.getPhoneCallInfo();
  const currentPhone = currentPhoneCallInfo.phone;

  return removeNonNumericChars(file.name).includes(currentPhone);
}
