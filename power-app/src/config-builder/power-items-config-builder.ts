import type {PowerItem, PowerItemsConfig} from './types';

export class PowerItemsConfigBuilder {
  private config: PowerItemsConfig = {};

  add(item: PowerItem): this {
    this.config[item.name] = item.config;
    return this;
  }

  build(): PowerItemsConfig {
    return this.config;
  }
}
