import {GeneralDeclareWithInputs, PowerAppVersion} from '@makeflow/power-app';

export type PowerNodeConfig = PowerAppVersion.PowerNode.Definition<
  GeneralDeclareWithInputs
>;

export type PowerNodesConfig = {
  [x: string]: PowerNodeConfig;
};

export type PowerNode = {
  name: string;
  config: PowerNodeConfig;
};

export type PowerItemConfig = PowerAppVersion.PowerItem.Definition<
  GeneralDeclareWithInputs
>;

export type PowerItemsConfig = {
  [x: string]: PowerItemConfig;
};

export type PowerItem = {
  name: string;
  config: PowerItemConfig;
};
