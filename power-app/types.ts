import type {Context} from '@makeflow/power-app';
import type {Dict} from 'tslang';

export type PowerNodeHookContext = Context<
  'power-node',
  Dict<any>,
  Dict<any> | undefined
>;

export type PowerNodeHookData = {
  context: PowerNodeHookContext;
  inputs: Dict<any>;
};
