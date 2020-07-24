import Router from '@koa/router';
import {Path} from 'path-parser';

export interface Controller {
  method: 'get' | 'post';
  path: string;
  handlers: Router.Middleware[];
}

export class AppControllersBuilder {
  private controllers: Controller[] = [];
  private pathPatterns: Path[] = [];

  add(controller: Controller): this {
    this.controllers.push(controller);
    this.pathPatterns.push(new Path(controller.path));
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
