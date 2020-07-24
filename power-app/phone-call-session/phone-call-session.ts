import {nanoid} from 'nanoid';
import {ErrorResponse, RecordFile} from '../model';
import type {SessionID, Task} from './types';

class PhoneCallSession {
  private tasks = new Map<SessionID, Task>();

  createSession(task: Task): SessionID {
    const id = nanoid();
    this.tasks.set(id, task);
    return id;
  }

  verify(id: SessionID): void {
    if (!this.tasks.has(id)) {
      throw ErrorResponse.badRequest(`no session matched id '${id}'`);
    }
  }

  async upload(id: SessionID, files: RecordFile[]): Promise<void> {
    const task = this.getTask(id);
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
  }

  async done(id: SessionID): Promise<void> {
    const task = this.getTask(id);
    await task.context.api.updatePowerNode({stage: 'done'});
    this.tasks.delete(id);
  }

  private getTask(id: SessionID): Task {
    this.verify(id);
    return this.tasks.get(id)!;
  }
}

export const phoneCallSession = new PhoneCallSession();
