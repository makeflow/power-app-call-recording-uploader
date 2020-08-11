import {useIsVisible, useSafeEffect, useVisibleEffect} from '@/hooks';
import {PhoneCallInfo} from '@/models';
import {useGotoPhoneCall} from '@/routes';
import {GlobalState} from '@/store';
import {Color} from '@/themes/colors';
import {showError} from '@/utils';
import React, {useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import QRCodeScanner, {Event} from 'react-native-qrcode-scanner';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.pureBlack,
  },

  scannerContainer: {
    transform: [{scale: 1.2}],
  },

  scannerCamera: {
    backgroundColor: Color.white,
  },

  scannerMarker: {
    borderColor: Color.white,
  },
});

export default function Scanner() {
  const gotoPhoneCall = useGotoPhoneCall();

  const scannerRef = useRef<QRCodeScanner | null>(null);
  const reactivateScanner = () => {
    const scanner = scannerRef.current;
    scanner?.reactivate();
  };

  useVisibleEffect(reactivateScanner);

  const [scannerClosed, setScannerClosed] = useState(false);
  const isVisible = useIsVisible();

  useSafeEffect(
    (safeSet) => {
      if (isVisible) {
        safeSet(setScannerClosed, false);
      } else {
        // 动画完成后再关闭相机，使动画更流畅
        setTimeout(() => {
          safeSet(setScannerClosed, true);
        }, 500);
      }
    },
    [isVisible],
  );

  const onReadData = (e: Event) => {
    try {
      const data = PhoneCallInfo.fromJSON(e.data);
      GlobalState.setPhoneCallInfo(data);
      gotoPhoneCall();
    } catch (error) {
      if (error instanceof TypeError) {
        Alert.alert('二维码错误！', '请扫描正确的二维码', [
          {text: 'OK', onPress: reactivateScanner},
        ]);
      } else {
        showError(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {scannerClosed ? null : (
        <QRCodeScanner
          showMarker
          ref={scannerRef}
          containerStyle={styles.scannerContainer}
          markerStyle={styles.scannerMarker}
          cameraStyle={styles.scannerCamera}
          onRead={onReadData}
        />
      )}
    </View>
  );
}
