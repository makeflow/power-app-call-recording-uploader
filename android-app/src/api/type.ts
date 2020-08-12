import {ThrottledEventStream} from '@/utils';

export enum UploadParams {
  ID = 'id',
  RecordFile = 'record_file',
}

export type UploadFileHandler = {
  /** 返回 true 表示上传正常，false 表示用户取消 */
  start(): Promise<boolean>;

  stop(): void;

  retry(): UploadFileHandler;

  progressEvent: ThrottledEventStream<number>;
};
