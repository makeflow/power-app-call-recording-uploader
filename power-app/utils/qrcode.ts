import {toDataURL} from 'qrcode';

export async function dataURLFromObject(obj: object): Promise<string> {
  return await toDataURL(JSON.stringify(obj));
}
