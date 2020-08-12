import {File} from '@/models';

export enum OperationMode {
  Default = 'default',
  Upload = 'upload',
  Uploading = 'uploading',
  Done = 'done',
}

export type UploadModalProps = {
  show: boolean;
  files: File[];
  onClose: (ok: boolean) => void;
};

export type RecordFileInfoProps = {
  file: File;
  showingState?: boolean;
};
