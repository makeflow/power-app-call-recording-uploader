import {PowerNodesConfigBuilder} from '../../config-builder';
import generateQRCode from './generate-qrcode';

export const powerNodes = new PowerNodesConfigBuilder()
  .add(generateQRCode)
  .build();
