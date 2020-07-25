import {PowerApp} from '@makeflow/power-app';
import Koa from 'koa';
import {port} from './config';
import controllers from './controller';
import {response} from './middleware';
import {version} from './power-app.json';
import powerNodes from './power-nodes';

const powerApp = new PowerApp();

powerApp.version(version, {
  contributions: {
    powerNodes,
  },
});

const app = new Koa();

app.use(response).use(controllers).use(powerApp.koa());

app.listen({port});
