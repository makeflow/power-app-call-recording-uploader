import type {Context, GeneralDeclare} from '@makeflow/power-app';
import { PowerNodeHookData } from '../types';

export type SessionID = string;

export type Task = {
  id: string;
  context: PowerNodeHookData['context'];
};