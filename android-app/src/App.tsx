import {
  BottomTabBarOptions,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {NavigationContainer, RouteProp} from '@react-navigation/native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Home} from './containers/Home';
import Setting from './containers/Setting';
import './init';
import {PagesTitle} from './routes';
import {Color} from './themes/colors';

const Tab = createBottomTabNavigator();

const tabBarOptions: BottomTabBarOptions = {
  activeTintColor: Color.blue,
  inactiveTintColor: Color.gray,
};

const screenOptions = (props: {
  route: RouteProp<Record<string, object | undefined>, string>;
}): BottomTabNavigationOptions => ({
  tabBarIcon: ({focused, color, size}) => {
    const route = props.route;
    let iconName = '';

    if (route.name === PagesTitle.Home) {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === PagesTitle.Setting) {
      iconName = focused ? 'settings' : 'settings-outline';
    }

    return <Icon name={iconName} size={size} color={color} />;
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={tabBarOptions}
        screenOptions={screenOptions}>
        <Tab.Screen name={PagesTitle.Home} component={Home} />
        <Tab.Screen name={PagesTitle.Setting} component={Setting} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
