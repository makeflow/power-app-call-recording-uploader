export class DescriptionErrorMessage extends Error {
  static readonly NO_CONFIG = new DescriptionErrorMessage('未配置应用');

  static readonly NO_PHONE_NUMBER = new DescriptionErrorMessage(
    '请输入电话号码',
  );

  static readonly PHONE_NUMBER_FORMAT_ERROR = new DescriptionErrorMessage(
    '电话号码格式错误，请重新输入',
  );

  public readonly name: string = 'UserFriendlyErrorMessage';

  constructor(message: string) {
    super('错误：' + message);
  }
}
