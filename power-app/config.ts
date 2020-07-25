export let port: number;
export let uploadEndpoint: string;

if (process.env.NODE_ENV === 'production') {
  port = 8802;
  uploadEndpoint =
    'https://power-apps.makeflow.com/call-recording-uploader/upload-record';
} else {
  port = 9999;
  uploadEndpoint = '';
}
