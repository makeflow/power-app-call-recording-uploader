import validator from 'validator';

export function isPhoneNumberValid(phone: string | undefined): phone is string {
  if (typeof phone !== 'string') {
    return false;
  }

  if (process.env.NODE_ENV === 'development') {
    if (phone === '10010' || phone === '10086') {
      return true;
    }
  }

  return validator.isMobilePhone(phone, 'zh-CN');
}
