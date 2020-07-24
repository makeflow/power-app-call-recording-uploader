import {Linking} from 'react-native';

export async function systemPhoneCall(phone: string) {
  await Linking.openURL(`tel:${phone}`);
}
