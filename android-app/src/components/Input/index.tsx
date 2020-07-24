import {Color} from '@/themes/colors';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Props} from './types';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 16,
    borderColor: Color.lightGray,
    color: Color.black,
    borderWidth: 2,
    paddingHorizontal: 10,
  },
});

export default function Input(props: Props) {
  const {icon, label, onChange, defaultValue, onPress} = props;

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    // 需要手动激活一次 TextInput 才能使用粘贴复制等原生功能，估计是 bug，囧
    setEditable(true);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {icon} {label}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <TextInput
          pointerEvents="none"
          editable={editable && !onPress}
          style={styles.input}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      </TouchableOpacity>
    </View>
  );
}
