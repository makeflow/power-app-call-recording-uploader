import {UploadRecordApiParams} from '../model';
import {phoneCallSession, SessionID} from '../phone-call-session';

export async function uploadRecordService(
  params: UploadRecordApiParams,
): Promise<void> {
  const {id, recordFiles} = params;
  await phoneCallSession.upload(id, recordFiles);
}

export async function removeSessionServive(id: SessionID): Promise<void> {
  await phoneCallSession.done(id);
}
