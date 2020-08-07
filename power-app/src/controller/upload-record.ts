import {Context as PowerAppContext, PowerApp} from '@makeflow/power-app';
import type {File, Files} from 'formidable';
import {createReadStream} from 'fs';
import type {Context, Next} from 'koa';
import body from 'koa-body';
import {ErrorResponse, RecordFile, UploadRecordApiParams} from '../model';
import {uploadRecordService} from '../service';
import {Controller} from './controller';

const MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024;

const parseBody = body({
  multipart: true,
  formidable: {
    maxFileSize: MAX_UPLOAD_FILE_SIZE,
  },
});

export const uploadRecordControllers: Controller[] = [
  {
    method: 'post',
    path: '/upload-record/:id',
    handlers: [getPowerAppContext, parseBody, uploadRecordFiles],
  },
];

async function getPowerAppContext(ctx: Context, next: Next) {
  const id = ctx.params.id;

  if (typeof id !== 'string') {
    throw ErrorResponse.badRequest('id is required');
  }

  const powerApp: PowerApp = ctx.state.powerApp;
  const filter = {storage: {id}};

  const [powerNodeContexts, powerItemContexts] = await Promise.all([
    powerApp.getContexts('power-node', filter),
    powerApp.getContexts('power-item', filter),
  ]);

  let powerAppContext = powerNodeContexts.length
    ? powerNodeContexts[0]
    : powerItemContexts.length
    ? powerItemContexts[0]
    : null;

  if (!powerAppContext) {
    throw ErrorResponse.notFound(`no task matched id '${id}'`);
  }

  ctx.state.powerAppContext = powerAppContext;

  await next();
}

async function uploadRecordFiles(ctx: Context) {
  const rawFiles = ctx.request.files;
  const recordFiles = rawFilesToRecordFiles(rawFiles);

  const powerAppContext: PowerAppContext<'power-node' | 'power-item'> =
    ctx.state.powerAppContext;
  const taskId = await powerAppContext.storage.get('taskId');

  await uploadRecordService(powerAppContext, taskId, recordFiles);
}

function rawFilesToRecordFiles(rawFiles?: Files): RecordFile[] {
  if (!rawFiles) {
    throw ErrorResponse.badRequest('at least one record file is required');
  }

  let files = (rawFiles[
    UploadRecordApiParams.RECORD_FILE
  ] as unknown) as File[];

  files = Array.isArray(files) ? files : [files];

  return files.map(file => ({
    content: createReadStream(file.path),
    name: file.name,
    type: file.type,
  }));
}
