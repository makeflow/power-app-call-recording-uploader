import {Context} from '@makeflow/power-app';
import ffmpeg from 'fluent-ffmpeg';
import {Readable, Transform, TransformCallback} from 'stream';
import {RecordFile} from '../model';

const AMR_FILE_NAME_REGEX = /\.amr$/;

export async function uploadRecordService(
  powerAppContext: Context<'power-node' | 'power-item'>,
  taskId: string,
  recordFiles: RecordFile[],
): Promise<void> {
  await Promise.all(
    recordFiles.map(file => {
      file = transcodeRecordFile(file);

      return powerAppContext.api.sendTaskFileMessage(
        taskId as any,
        file.content,
        file.name,
        file.type,
      );
    }),
  );
}

function transcodeRecordFile(file: RecordFile): RecordFile {
  if (!AMR_FILE_NAME_REGEX.test(file.name) && !file.type.includes('amr')) {
    return file;
  }

  file.content = transcodeAmrToMp3(
    file.content,
    () => {
      console.log(`'${file.name}' transcoding completed.`);
    },
    error => {
      console.error(error);
    },
  );

  file.name = file.name.replace(AMR_FILE_NAME_REGEX, '.mp3');

  file.type = 'audio/mp3';

  return file;
}

function transcodeAmrToMp3(
  stream: Readable,
  onEnd?: () => void,
  onError?: (error: Error) => void,
): Readable {
  let command = ffmpeg(stream);
  let transformer = new FFmpegTransformer();

  command.toFormat('mp3').output(transformer).run();

  transformer.on('error', error => {
    onError?.(error);
  });
  transformer.on('end', () => {
    onEnd?.();
  });

  return transformer;
}

class FFmpegTransformer extends Transform {
  _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    this.push(chunk);
    callback();
  }
}
