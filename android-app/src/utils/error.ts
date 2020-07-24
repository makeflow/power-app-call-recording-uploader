import {Alert} from 'react-native';

export function showError(error: Error): void {
  Alert.alert('ERROR!', error.message);
}
