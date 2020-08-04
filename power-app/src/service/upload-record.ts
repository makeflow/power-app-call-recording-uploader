import {Context} from '@makeflow/power-app';
import {RecordFile} from '../model';

export async function uploadRecordService(
  powerAppContext: Context<'power-node' | 'power-item'>,
  taskId: string,
  recordFiles: RecordFile[],
): Promise<void> {
  await Promise.all(
    recordFiles.map(file =>
      powerAppContext.api.sendTaskFileMessage(
        taskId as any,
        file.content,
        file.name,
        file.type,
      ),
    ),
  );
}
