import {Dict} from 'tslang';
import {DescriptionErrorMessage} from '../error-message';
import {isPhoneNumberValid} from '../utils';

export function verifyPhone(phone?: string): void {
  if (!phone) {
    throw DescriptionErrorMessage.NO_PHONE_NUMBER;
  }

  if (!isPhoneNumberValid(phone)) {
    throw DescriptionErrorMessage.PHONE_NUMBER_FORMAT_ERROR;
  }
}

export function verifyFields(obj: Dict<any>, ...fields: string[]): void {
  const missingFields = [];
  for (const field of fields) {
    if (!Reflect.has(obj, field) || typeof obj[field] === 'undefined') {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    throw new Error(`missing fields: ${missingFields.join(', ')}`);
  }
}
