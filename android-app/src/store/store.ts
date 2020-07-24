import {File, PhoneCallInfo} from '@/models';
import {GlobalStoreKey} from './type';

export const initStoreData = {
  [GlobalStoreKey.AppDoneInit]: false,
  [GlobalStoreKey.PhoneCallMode]: false,
  [GlobalStoreKey.CurrentPhoneCallInfo]: PhoneCallInfo.empty(),
  [GlobalStoreKey.CurrentFiles]: [] as File[],
};
