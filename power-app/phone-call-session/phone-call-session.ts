import {nanoid} from 'nanoid';
import {ErrorResponse, RecordFile} from '../model';
import type {SessionID, Task} from './types';

const MAX_SESSION_DURATION = 3 * 3600 * 1000; // 3 hours in millisecond
const CLEAR_LOOP_INTERVAl = 0.5 * 3600 * 1000; // half hours in millisecond

class PhoneCallSession {
  private tasks = new Map<SessionID, Task>();
  private clearLoop: NodeJS.Timeout;

  constructor() {
    this.clearLoop = setInterval(this.clearTasks, CLEAR_LOOP_INTERVAl);
  }

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

  private clearTasks = () => {
    const now = Date.now();
    const garbageTaskIds: SessionID[] = [];

    for (const [id, task] of this.tasks) {
      if (now - task.createTime > MAX_SESSION_DURATION) {
        garbageTaskIds.push(id);
      }
    }

    for (const id of garbageTaskIds) {
      this.tasks.delete(id);
    }
  };
}

export const phoneCallSession = new PhoneCallSession();
