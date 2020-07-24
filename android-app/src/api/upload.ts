import {File} from '@/models';
import {GlobalState} from '@/store';
import {getPercentage, SingleEvent, ThrottledEventStream} from '@/utils';
import axios from 'axios';
import {UploadFileHandler, UploadParams} from './type';

async function upload(
  url: string,
  files: File[],
  progressEvent: ThrottledEventStream<number>,
  stopEvent: SingleEvent<void>,
): Promise<boolean> {
  const body = new FormData();
  files.forEach((file) => {
    body.append(UploadParams.RecordFile, {
      uri: 'file://' + file.path,
      name: file.name,
      type: file.type,
    });
  });

  const cancelSource = axios.CancelToken.source();
  stopEvent.onTrigger(() => cancelSource.cancel());

  try {
    // TODO: 大一点的文件（测试中280MB）就会将 app 卡死闪退，原因未知
    const res = await axios.post(url, body, {
      onUploadProgress: (event) => {
        const percentage = getPercentage(event.loaded, event.total);
        progressEvent.emit(Math.min(percentage, 99));
      },
      cancelToken: cancelSource.token,
    });

    if (res.data.code !== 200) {
      throw new Error(res.data.message);
    }

    progressEvent.emit(100);
    return true;
  } catch (error) {
    if (axios.isCancel(error)) {
      return false;
    } else {
      throw error;
    }
  }
}

function getAndVerifyURL(): string {
  const {uploadURL} = GlobalState.getPhoneCallInfo();

  if (!uploadURL) {
    throw new Error('currently no upload url set, cannot perform upload');
  }

  return uploadURL;
}

export function uploadFile(files: File[]): UploadFileHandler {
  const url = getAndVerifyURL();
  const progressEvent = new ThrottledEventStream<number>();
  const stopEvent = new SingleEvent<void>();

  return {
    files,
    progressEvent,
    start: () => upload(url, files, progressEvent, stopEvent),
    stop: () => stopEvent.emit(),
  };
}

export async function doneUploadFileSession(): Promise<void> {
  const url = getAndVerifyURL();
  const res = await axios.delete(url);

  if (res.data.code !== 200) {
    throw new Error(res.data.message);
  }
}
