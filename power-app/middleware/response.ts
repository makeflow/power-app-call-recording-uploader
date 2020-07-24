import {Middleware} from 'koa';
import {hasPath} from '../controller';
import {ErrorResponse, Response} from '../model';

export const response: Middleware = async (ctx, next) => {
  try {
    await next();
    // 不是 power-app 的接口
    if (hasPath(ctx.path)) {
      ctx.status = 200;
      ctx.body = Response.ok(ctx.body);
    }
  } catch (error) {
    if (!(error instanceof ErrorResponse)) {
      ctx.body = ErrorResponse.internalServerError(error.message);
    } else {
      ctx.body = error;
    }
  }
};
