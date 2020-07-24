import type {PowerNode, PowerNodesConfig} from './types';

export class PowerNodesConfigBuilder {
  private config: PowerNodesConfig = {};

  add(node: PowerNode): this {
    this.config[node.name] = node.config;
    return this;
  }

  build(): PowerNodesConfig {
    return this.config;
  }
}
