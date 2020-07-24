import StyledButton from '@/components/StyledButton';
import {useGotoScanner} from '@/routes';
import {Color} from '@/themes/colors';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  linearGradient: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },

  scanBtn: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

const scanIcon = <Icon name="scan1" size={75} color={Color.white} />;

export default function Scan() {
  const gotoScanner = useGotoScanner();
  const startScan = () => gotoScanner();

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0.2, y: 1}}
        end={{x: 0.8, y: 0}}
        colors={[Color.lightSkyblue, Color.skyblue]}
        style={styles.linearGradient}>
        <StyledButton
          style={styles.scanBtn}
          title={scanIcon}
          onPress={startScan}
        />
      </LinearGradient>
    </View>
  );
}
