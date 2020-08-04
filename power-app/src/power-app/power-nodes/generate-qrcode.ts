import {uploadEndpoint} from '../../config';
import {PowerNode} from '../../config-builder';
import {UploadRecordApiReturn} from '../../model';
import {showError, showQRCode} from '../../output-view';
import {PowerNodeHookData} from '../../types';
import {generateStringId} from '../../utils';
import {verifyFields, verifyPhone} from '../shared';

async function onHookChange(data: PowerNodeHookData) {
  const {
    inputs,
    context: {storage},
  } = data;

  try {
    verifyFields(inputs, 'taskId', 'phone');
    verifyPhone(inputs.phone);

    const id = generateStringId();
    storage.set('id', id);
    storage.set('taskId', inputs.taskId);

    const info = new UploadRecordApiReturn(id, inputs.phone, uploadEndpoint);
    return showQRCode(info);
  } catch (error) {
    return showError(error);
  }
}

const generateQRCode: PowerNode = {
  name: 'generate-qrcode',
  config: {
    activate: onHookChange,
    update: onHookChange,
  },
};

export default generateQRCode;
