import type {PowerItem} from '../config-builder';
import {showError} from '../output-view';

const demo: PowerItem = {
  name: 'demo',
  config: {
    activate({context: {configs, storage}, inputs}) {
      try {
      } catch (error) {
        return showError(error);
      }
    },

    update({context: {configs, storage}, inputs}) {},

    actions: {},
  },
};

export default demo;
