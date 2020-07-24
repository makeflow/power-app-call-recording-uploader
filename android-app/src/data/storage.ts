import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

enum Key {
  RecordFileDir = 'record-file-dir',
}

export class Storage {
  static readonly Key = Key;

  static async set(key: Key, val: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      Alert.alert('AppData 存储错误！', error.message);
    }
  }

  static async get(key: Key): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      Alert.alert('读取 AppData 错误！', error.message);
      return null;
    }
  }

  static async verifyRequiredDataExist(): Promise<void> {
    const data = await Promise.all([this.get(Key.RecordFileDir)]);
    if (data.some((d) => d === null)) {
      throw new Error('storage data incomplete');
    }
  }
}
