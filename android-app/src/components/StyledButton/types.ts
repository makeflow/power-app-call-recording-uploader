import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

export type Props = {
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title: string | JSX.Element;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
};
