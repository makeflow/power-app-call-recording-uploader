import {PowerApp} from '@makeflow/power-app';
import Koa from 'koa';
import {port, powerAppConfig, version} from './config';
import controllers from './controller';
import {globalState, response} from './middleware';
import powerNodes from './power-nodes';

const powerApp = new PowerApp(powerAppConfig);

powerApp.version(version, {
  contributions: {
    powerNodes,
  },
});

const app = new Koa();

app
  .use(response)
  .use(globalState({powerApp}))
  .use(controllers)
  .use(powerApp.koa());

app.listen({port});
