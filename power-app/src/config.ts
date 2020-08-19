import {PowerAppOptions} from '@makeflow/power-app';
import {readFileSync} from 'fs';
import path from 'path';

export let version: string;
export let port: number;
export let uploadEndpoint: string;
export let powerAppConfig: PowerAppOptions;

if (process.env.NODE_ENV === 'production') {
  version = readFileSync(path.resolve(__dirname, '../VERSION'), 'utf-8');

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

  version = config.version;

  port = Number(config.hookBaseURL.split(':')[2]);

  uploadEndpoint = 'http://192.168.31.102:9999/upload-record';

  powerAppConfig = {db: {type: 'lowdb', options: {}}};
}
