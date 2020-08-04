import {
  JsonProperty,
  Serializable,
  serialize,
} from 'typescript-json-serializer';
import urlJoin from 'url-join';

export type SessionID = string;

export type RecordFile = {
  content: Buffer | NodeJS.ReadableStream;
  name: string;
  type: string;
};

export interface IUploadRecordApiParams {
  id: string;
  recordFiles: RecordFile[];
}

export class UploadRecordApiParams implements IUploadRecordApiParams {
  id: SessionID;
  recordFiles: RecordFile[] = [];

  constructor(id: string) {
    this.id = id;
  }

  static ID = 'id';
  static RECORD_FILE = 'record_file';
}

export interface IUploadRecordApiReturn {
  phone: string;
  uploadURL: string;
}

@Serializable()
export class UploadRecordApiReturn implements IUploadRecordApiReturn {
  @JsonProperty({name: UploadRecordApiReturn.UPLOAD_URL})
  public uploadURL: string;

  @JsonProperty()
  public phone: string;

  constructor(id: SessionID, phone: string, uploadEndpoint: string) {
    this.uploadURL = urlJoin(uploadEndpoint, id);
    this.phone = phone;
  }

  toJSON(): string {
    return serialize(this);
  }

  static PHONE = 'phone';
  static UPLOAD_URL = 'upload_url';
}
