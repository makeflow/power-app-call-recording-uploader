import {PowerApp} from '@makeflow/power-app';
import Koa from 'koa';
import {port as productionPort} from './config.json';
import controllers from './controller';
import {config, response} from './middleware';
import {hookBaseURL, version} from './power-app.json';
import powerNodes from './power-nodes';
import {getPortFromUrl} from './utils/port';

const port =
  process.env.NODE_ENV === 'production'
    ? productionPort
    : getPortFromUrl(hookBaseURL);

const powerApp = new PowerApp();

powerApp.version(version, {
  contributions: {
    powerNodes,
  },
});

const app = new Koa();

app.use(response).use(config).use(controllers).use(powerApp.koa());

app.listen({port});
