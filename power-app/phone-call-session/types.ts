import {PowerNodeHookData} from '../types';

export type SessionID = string;

export type Task = {
  id: string;
  context: PowerNodeHookData['context'];
  createTime: number;
};
