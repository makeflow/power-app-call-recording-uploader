import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';

export type Props = {
  label: string;
  defaultValue?: string;
  icon?: JSX.Element;
  onChange?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  onPress?: () => void;
};
