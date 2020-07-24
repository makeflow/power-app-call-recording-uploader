import {nanoid} from 'nanoid';
import {ErrorResponse} from '../model';
import type {SessionID, Task} from './types';

class PhoneCallSession {
  private tasks = new Map<SessionID, Task>();

  add(task: Task): SessionID {
    const id = nanoid();
    this.tasks.set(id, task);
    return id;
  }

  get(id: SessionID): Task {
    this.verify(id);
    return this.tasks.get(id)!;
  }

  verify(id: SessionID): void {
    if (!this.tasks.has(id)) {
      throw ErrorResponse.badRequest(`no session matched id '${id}'`);
    }
  }

  done(id: SessionID): void {
    this.tasks.delete(id);
  }
}

export const phoneCallSession = new PhoneCallSession();
