import {RecordFile} from '@/types/native';
import {ReadDirItem} from 'react-native-fs';
import {lookup as lookupMime} from 'react-native-mime-types';

export interface File {
  path: string;
  name: string;
  type: string;
  size: number;
  mtime: Date;
  status: 'not-uploaded' | 'uploading' | 'uploaded' | 'upload-failed';
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

  public static fromRNDirItem(item: ReadDirItem): File {
    return {
      path: item.path,
      name: item.name,
      type: lookupMime(item.name) || 'application/octet-stream',
      size: Number(item.size),
      mtime: item.mtime || new Date(0),
      status: 'not-uploaded',
    };
  }
}
