import Router from '@koa/router';
import {AppControllersBuilder} from './controller';
import {uploadRecordController} from './upload-record';

const router = new Router();
const controllers = new AppControllersBuilder();

controllers.add(uploadRecordController);

controllers.applyTo(router);

export const hasPath = (path: string) => controllers.has(path);
export default router.routes();
