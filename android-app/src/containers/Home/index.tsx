import {Storage} from '@/data';
import {useVisibleEffect} from '@/hooks';
import {PagesTitle, useGotoSetting} from '@/routes';
import {GlobalStoreKey} from '@/store';
import {Color} from '@/themes/colors';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {Alert} from 'react-native';
import {useStore} from 'rlax';
import PhoneCall from './PhoneCall';
import Scan from './Scan';
import Scanner from './Scanner';

const HomeStack = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: Color.white,
  },
};

export function Home() {
  const gotoSetting = useGotoSetting();
  const appDoneInit = useStore(GlobalStoreKey.AppDoneInit);

  useVisibleEffect(() => {
    if (appDoneInit) {
      verifyAppConfigElse(gotoSetting);
    }
  }, [appDoneInit]);

  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name={PagesTitle.Scan} component={Scan} />
      <HomeStack.Screen name={PagesTitle.Scanner} component={Scanner} />
      <HomeStack.Screen name={PagesTitle.PhoneCall} component={PhoneCall} />
    </HomeStack.Navigator>
  );
}

function verifyAppConfigElse(noConfigAction: () => void): void {
  Storage.verifyRequiredDataExist().catch(() => {
    Alert.alert('请先设置APP', 'APP需要一些必要参数来运行，前往设置？', [
      {
        text: 'OK',
        onPress: () => noConfigAction(),
      },
    ]);
  });
}
