import type {CompositeValueDescriptor} from '@makeflow/types/value';
import {renderToStaticMarkup} from 'react-dom/server';
import type {Dict} from 'tslang';
import {DescriptionErrorMessage} from '../error-message';
import {IUploadRecordApiReturn} from '../model';
import {dataURLFromObject} from '../utils/qrcode';
import {errorView, qrCodeView, userFriendlyErrorView} from './view';

export interface PowerAppDescription {
  description: string;
}

export class PowerAppHookReturn implements PowerAppDescription {
  description: string;
  stage: 'done' | 'none' | undefined;
  output: Dict<CompositeValueDescriptor> | undefined;

  constructor(view: JSX.Element) {
    this.description = renderToStaticMarkup(view);
  }

  setOutputValue(key: string, value: CompositeValueDescriptor): this {
    if (!this.output) {
      this.output = {};
    }
    this.output[key] = value;
    return this;
  }

  done(): this {
    this.stage = 'done';
    return this;
  }
}

export function showError(error: Error): PowerAppHookReturn {
  const view =
    error instanceof DescriptionErrorMessage
      ? userFriendlyErrorView(error.message)
      : errorView(error.message, error.stack);
  return new PowerAppHookReturn(view);
}

export async function showQRCode(
  info: IUploadRecordApiReturn,
): Promise<PowerAppHookReturn> {
  const dataUrl = await dataURLFromObject(info);
  const view = qrCodeView(info.phone, dataUrl);
  return new PowerAppHookReturn(view);
}
