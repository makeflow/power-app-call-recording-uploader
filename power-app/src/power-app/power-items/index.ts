import {PowerItemsConfigBuilder} from '../../config-builder';
import generateQRCode from './generate-qrcode';

export const powerItems = new PowerItemsConfigBuilder()
  .add(generateQRCode)
  .build();
