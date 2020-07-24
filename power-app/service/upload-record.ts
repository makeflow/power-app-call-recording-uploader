import {UploadRecordApiParams} from '../model';
import {phoneCallSession} from '../phone-call-session';

export async function uploadRecordService(
  params: UploadRecordApiParams,
): Promise<void> {
  const sessionId = params.id;
  const task = phoneCallSession.get(sessionId);
  const files = params.recordFiles;
  await Promise.all(
    files.map(file =>
      task.context.api.sendTaskFileMessage(
        task.id as any,
        file.content,
        file.name,
        file.type,
      ),
    ),
  );
  phoneCallSession.done(sessionId);
}
