export interface File {
  path: string;
  name: string;
  type: string;
  size: number;
  mtime: Date;
  status: 'not-uploaded' | 'uploading' | 'uploaded' | 'upload-failed';
}

export interface RecordFile {
  path: string;
  name: string;
  type: string;
  size: number;
  mtime: number;
}

export class File {
  private constructor() {}

  public static fromRecordFile(recordFile: RecordFile): File {
    return {
      path: recordFile.path,
      name: recordFile.name,
      type: recordFile.type,
      size: recordFile.size,
      mtime: new Date(recordFile.mtime),
      status: 'not-uploaded',
    };
  }
}
