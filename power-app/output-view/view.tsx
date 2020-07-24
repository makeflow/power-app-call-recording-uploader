import React from 'react';

export function errorView(message: string, stack?: string): JSX.Element {
  return (
    <pre>
      <code>
        {message}
        {'\n'}
        {stack}
      </code>
    </pre>
  );
}

export function userFriendlyErrorView(message: string): JSX.Element {
  return <b>{message}</b>;
}

export function qrCodeView(phone: string, dataUrl: string): JSX.Element {
  return (
    <>
      <p>请在APP中扫码进行拨号与录音</p>
      <p>
        <b>注意核对电话号码，当前号码：</b>
        {phone}
      </p>
      <img src={dataUrl} alt="QRCode" />
    </>
  );
}
