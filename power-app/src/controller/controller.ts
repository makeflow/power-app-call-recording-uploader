import Router from '@koa/router';
import {Path} from 'path-parser';

export interface Controller {
  method: 'get' | 'post' | 'delete';
  path: string;
  handlers: Router.Middleware[];
}

export class AppControllersBuilder {
  private controllers: Controller[] = [];
  private pathPatterns: Path[] = [];

  add(controllers: Controller[]): this {
    this.controllers.push(...controllers);
    this.pathPatterns.push(
      ...controllers.map(controller => new Path(controller.path)),
    );
    return this;
  }

  applyTo(router: Router): void {
    for (const controller of this.controllers) {
      router[controller.method](controller.path, ...controller.handlers);
    }
  }

  has(path: string): boolean {
    return this.pathPatterns.some(p => p.test(path) !== null);
  }
}
