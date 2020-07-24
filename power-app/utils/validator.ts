import validator from 'validator';

export function isPhoneNumberValid(phone: string | undefined): phone is string {
  if (typeof phone !== 'string') {
    return false;
  }
  return validator.isMobilePhone(phone, 'zh-CN');
}
