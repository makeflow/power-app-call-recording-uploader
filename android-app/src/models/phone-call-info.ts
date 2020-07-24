export interface IPhoneCallInfo {
  phone: string;
  uploadURL: string;
}

enum APIFields {
  UploadURL = 'upload_url',
  Phone = 'phone',
}

export class PhoneCallInfo implements IPhoneCallInfo {
  constructor(public phone: string, public uploadURL: string) {}

  static fromJSON(json: string): IPhoneCallInfo {
    const data = JSON.parse(json);
    const uploadURL = data[APIFields.UploadURL];
    const phone = data[APIFields.Phone];
    if (typeof uploadURL !== 'string' || typeof phone !== 'string') {
      throw new TypeError('invalid json');
    }
    return new PhoneCallInfo(phone, uploadURL);
  }

  static empty(): IPhoneCallInfo {
    return {phone: '', uploadURL: ''};
  }
}
