import {PowerAppOptions} from '@makeflow/power-app';

export let port: number;
export let uploadEndpoint: string;
export let powerAppConfig: PowerAppOptions;

if (process.env.NODE_ENV === 'production') {
  port = Number(process.env.PORT);

  uploadEndpoint =
    'https://power-apps.makeflow.com/call-recording-uploader/upload-record';

  powerAppConfig = {
    db: {
      type: 'mongo',
      options: {
        uri: 'mongodb://mongo:27017',
        name: 'call-recording-uploader',
      },
    },
  };
} else {
  const config = require('../power-app.json');

  port = Number(config.hookBaseURL.split(':')[2]);

  uploadEndpoint = 'http://192.168.31.102:9999/upload-record';

  powerAppConfig = {db: {type: 'lowdb', options: {}}};
}
