export let port: number;
export let uploadEndpoint: string;

if (process.env.NODE_ENV === 'production') {
  const portStr = process.env.PORT;

  if (!portStr) {
    throw new Error("env 'PORT' not set!");
  }

  port = Number(portStr);
  uploadEndpoint =
    'https://power-apps.makeflow.com/call-recording-uploader/upload-record';
} else {
  port = 9999;
  uploadEndpoint = '';
}
