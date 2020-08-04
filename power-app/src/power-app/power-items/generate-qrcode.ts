import {uploadEndpoint} from '../../config';
import {PowerItem} from '../../config-builder';
import {UploadRecordApiReturn} from '../../model';
import {showError, showQRCode} from '../../output-view';
import {PowerItemHookData} from '../../types';
import {generateStringId} from '../../utils';
import {verifyFields, verifyPhone} from '../shared';

async function onHookChange(data: PowerItemHookData) {
  const {
    inputs,
    context: {storage},
  } = data;

  try {
    verifyFields(inputs, 'taskId');
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

const generateQRCode: PowerItem = {
  name: 'generate-qrcode',
  config: {
    activate: onHookChange,
    update: onHookChange,
  },
};

export default generateQRCode;
