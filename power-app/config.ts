export let version: string;
export let port: number;
export let uploadEndpoint: string;

if (process.env.NODE_ENV === 'production') {
  version = process.env.VERSION as string;
  port = Number(process.env.PORT);
  uploadEndpoint =
    'https://power-apps.makeflow.com/call-recording-uploader/upload-record';
} else {
  const config = require('./power-app.json');
  version = config.version;
  port = Number(config.hookBaseURL.split(':')[2]);
  uploadEndpoint = '';
}
