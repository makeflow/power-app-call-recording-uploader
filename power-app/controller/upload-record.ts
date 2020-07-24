import type {File} from 'formidable';
import {createReadStream} from 'fs';
import type {Context, Next} from 'koa';
import body from 'koa-body';
import {ErrorResponse, UploadRecordApiParams} from '../model';
import {phoneCallSession} from '../phone-call-session';
import {uploadRecordService} from '../service';
import {Controller} from './controller';

const MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024;

const parseBody = body({
  multipart: true,
  formidable: {
    maxFileSize: MAX_UPLOAD_FILE_SIZE,
  },
});

export const uploadRecordController: Controller = {
  method: 'post',
  path: '/upload-record/:id',
  handlers: [validateSession, parseBody, uploadRecordFiles],
};

async function validateSession(ctx: Context, next: Next) {
  const id = ctx.params.id;
  if (typeof id !== 'string') {
    throw ErrorResponse.badRequest('id is required');
  }
  phoneCallSession.verify(id);
  await next();
}

async function uploadRecordFiles(ctx: Context) {
  const files = ctx.request.files;
  if (!files) {
    throw ErrorResponse.badRequest('at least one record file is required');
  }
  const id = ctx.params.id;
  const params = new UploadRecordApiParams(id);
  let recordFiles = (files[
    UploadRecordApiParams.RECORD_FILE
  ] as unknown) as File[];
  recordFiles = Array.isArray(recordFiles) ? recordFiles : [recordFiles];
  params.recordFiles = recordFiles.map(file => ({
    content: createReadStream(file.path),
    name: file.name,
    type: file.type,
  }));
  await uploadRecordService(params);
}
