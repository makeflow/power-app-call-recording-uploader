import {Middleware} from 'koa';
import {Dict} from 'tslang';

export function globalState(states: Dict<any>): Middleware {
  return async (ctx, next) => {
    Object.assign(ctx.state, states);

    await next();
  };
}
