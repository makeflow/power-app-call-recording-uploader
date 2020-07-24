import {Color} from '@/themes/colors';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Props} from './types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.blue,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  spinner: {
    transform: [{scale: 0.8}],
  },

  loading: {
    opacity: 0.8,
  },
});

export default function StyledButton(props: Props) {
  const {style, titleStyle, title, onPress, disabled, loading} = props;

  const spinnerColor = titleStyle
    ? Reflect.get(titleStyle, 'color') ?? Color.white
    : Color.white;

  return (
    <TouchableOpacity
      style={[styles.container, style, loading ? styles.loading : null]}
      onPress={onPress}
      disabled={disabled}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={spinnerColor}
          style={styles.spinner}
        />
      ) : null}
      {typeof title === 'string' ? (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      ) : (
        title
      )}
    </TouchableOpacity>
  );
}
