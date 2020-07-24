import {useNavigation} from '@react-navigation/native';

export enum PagesTitle {
  Home = '主页',
  Scan = '扫码通话',
  Setting = '设置',
  PhoneCall = '拨打电话',
  Scanner = '扫一扫',
}

type Params = {
  [k: string]: any;
};

function useGoto(page: PagesTitle) {
  const nav = useNavigation();
  return (params?: Params) => nav.navigate(page, params);
}

export const useGotoHome = () => useGoto(PagesTitle.Home);
export const useGotoSetting = () => useGoto(PagesTitle.Setting);
export const useGotoPhoneCall = () => useGoto(PagesTitle.PhoneCall);
export const useGotoScan = () => useGoto(PagesTitle.Scan);
export const useGotoScanner = () => useGoto(PagesTitle.Scanner);
