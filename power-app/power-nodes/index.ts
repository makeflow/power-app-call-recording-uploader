import {PowerNodesConfigBuilder} from '../config-builder';
import generateQRCode from './generate-qrcode';

export default new PowerNodesConfigBuilder().add(generateQRCode).build();
