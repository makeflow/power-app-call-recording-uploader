export function errorView(message: string, stack?: string): string {
  return `
    <code>
      ${message}${stack ? `<br />${stack}` : ''}
    </code>
  `;
}

export function userFriendlyErrorView(message: string): string {
  return `<b>${message}</b>`;
}

export function qrCodeView(phone: string, dataUrl: string): string {
  return `
    <p>请在APP中扫码进行拨号与录音</p>
    <p><b>注意核对电话号码，当前号码：</b>${phone}</p>
    <img src="${dataUrl}" alt="QRCode" />
  `;
}