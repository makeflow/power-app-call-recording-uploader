import {Middleware} from 'koa';
import serverConfig from '../config.json';

export const config: Middleware = async (ctx, next) => {
  ctx.state.serverConfig = serverConfig;
  await next();
};
