import type {Context} from '@makeflow/power-app';
import type {Dict} from 'tslang';

export type PowerItemHookContext = Context<
  'power-item',
  Dict<any>,
  Dict<any> | undefined
>;

export type PowerItemHookData = {
  context: PowerItemHookContext;
  inputs: Dict<any>;
};
