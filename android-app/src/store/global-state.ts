import {File, IPhoneCallInfo, PhoneCallInfo} from '@/models';
import {getStore, setStore} from 'rlax';
import {GlobalStoreKey} from './type';

export class GlobalState {
  private constructor() {}

  public static doneAppInit(): void {
    setStore(GlobalStoreKey.AppDoneInit, true);
  }

  public static isAppInitialized(): boolean {
    return getStore(GlobalStoreKey.AppDoneInit);
  }

  public static isInPhoneCallProcess(): boolean {
    return getStore(GlobalStoreKey.PhoneCallMode);
  }

  public static startPhoneCallTask(): void {
    setStore(GlobalStoreKey.PhoneCallMode, true);
  }

  public static setPhoneCallInfo(phoneCallInfo: IPhoneCallInfo): void {
    setStore(GlobalStoreKey.CurrentPhoneCallInfo, phoneCallInfo);
  }

  public static getPhoneCallInfo(): IPhoneCallInfo {
    return getStore(GlobalStoreKey.CurrentPhoneCallInfo);
  }

  public static stopPhoneCallTask(): void {
    setStore(GlobalStoreKey.PhoneCallMode, false);
    setStore(GlobalStoreKey.CurrentPhoneCallInfo, PhoneCallInfo.empty());
    setStore(GlobalStoreKey.CurrentFiles, []);
  }

  public static getFiles(): File[] {
    return getStore(GlobalStoreKey.CurrentFiles);
  }

  public static addFile(file: File): void {
    const currentFiles = GlobalState.getFiles();

    if (currentFiles.some(({path}) => path === file.path)) {
      return;
    }

    setStore(GlobalStoreKey.CurrentFiles, [file, ...currentFiles]);
  }

  public static setFileUploading(file: File): void {
    GlobalState.setFileStatus(file, 'uploading');
  }

  public static setFileUploaded(file: File): void {
    GlobalState.setFileStatus(file, 'uploaded');
  }

  public static setFileUploadFailed(file: File): void {
    GlobalState.setFileStatus(file, 'upload-failed');
  }

  private static setFileStatus(file: File, status: File['status']): void {
    const currentFiles = GlobalState.getFiles();
    const f = currentFiles.find(({path}) => path === file.path);
    if (f) {
      f.status = status;
      setStore(GlobalStoreKey.CurrentFiles, [...currentFiles]);
    }
  }
}
