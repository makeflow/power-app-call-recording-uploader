import {Dict} from 'tslang';
import {PowerNode} from '../config-builder';
import {upload_endpoint as uploadEndpoint} from '../config.json';
import {DescriptionErrorMessage} from '../error-message';
import {UploadRecordApiReturn} from '../model';
import {showError, showQRCode} from '../output-view';
import {phoneCallSession} from '../phone-call-session';
import {PowerNodeHookData} from '../types';
import {isPhoneNumberValid} from '../utils/validator';

function verifyPhone(phone: string): void {
  if (!isPhoneNumberValid(phone)) {
    throw DescriptionErrorMessage.PHONE_NUMBER_FORMAT_ERROR;
  }
}

function verifyFields(obj: Dict<any>, ...fields: string[]): void {
  const missingFields = [];
  for (const field of fields) {
    if (!Reflect.has(obj, field) || typeof obj[field] === 'undefined') {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    throw new Error(`missing fields: ${missingFields.join(', ')}`);
  }
}

async function onHookChange(data: PowerNodeHookData) {
  const {inputs, context} = data;
  try {
    verifyFields(inputs, 'taskId', 'phone');
    verifyPhone(inputs.phone);
    const sessionId = phoneCallSession.createSession({
      id: inputs.taskId as string,
      context,
      createTime: Date.now(),
    });
    const info = new UploadRecordApiReturn(
      sessionId,
      inputs.phone,
      uploadEndpoint,
    );
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
    actions: {
      refresh: onHookChange,
    },
  },
};

export default generateQRCode;
