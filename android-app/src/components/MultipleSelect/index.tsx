import {GroupState, useGroupState} from '@/hooks';
import {Color} from '@/themes/colors';
import {doNothing, getEmptyArray} from '@/utils';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Option, Props} from './type';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },

  emptyContentNotice: {
    color: Color.gray,
  },

  optionContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  checkbox: {
    marginRight: 10,
  },

  checkboxDisabled: {
    padding: 4,
    marginLeft: 1,
  },
});

const disabledCheckboxIcon = (
  <Icon
    name="checkbox-blank-off-outline"
    size={24}
    color={Color.lightGray}
    style={[styles.checkbox, styles.checkboxDisabled]}
  />
);

// TODO: 性能优化
export default function MultipleSelect<T>(props: Props<T>) {
  const {options, emptyNotice, onSelect, disabled} = props;

  const checkboxStates = useGroupState<string, boolean>();
  const lastUpdateMarkerRef = useRef<number>(checkboxStates.updateMarker);

  const getValues = options
    ? () =>
        options
          .filter((o) => !o.disabled && checkboxStates.get(o.id))
          .map((o) => o.value)
    : getEmptyArray;
  const postNewValues = onSelect ? () => onSelect(getValues()) : doNothing;

  if (options && checkboxStates.size === 0) {
    for (const {id, selected} of options) {
      if (typeof selected === 'boolean') {
        checkboxStates.set(id, selected);
      }
    }
  }

  useEffect(postNewValues, []);

  useEffect(() => {
    if (
      onSelect &&
      options &&
      checkboxStates.updateMarker !== lastUpdateMarkerRef.current
    ) {
      lastUpdateMarkerRef.current = checkboxStates.updateMarker;
      postNewValues();
    }
  }, [
    onSelect,
    options,
    checkboxStates,
    checkboxStates.updateMarker,
    postNewValues,
  ]);

  if (!options || !options.length) {
    return <Text style={styles.emptyContentNotice}>{emptyNotice ?? ''}</Text>;
  }

  return (
    <View style={styles.container} pointerEvents={disabled ? 'none' : 'auto'}>
      <FlatList
        data={createFlatListData(checkboxStates, options)}
        renderItem={({item}) => item.content}
        keyExtractor={({id}) => id}
      />
    </View>
  );
}

function createFlatListData<T>(
  checkboxStates: GroupState<string, boolean>,
  options: Option<T>[],
) {
  const onOptionPress = (id: string) => {
    const currentState = checkboxStates.get(id);
    if (currentState) {
      checkboxStates.set(id, false);
    } else {
      checkboxStates.set(id, true);
    }
  };

  return options.map((option) => ({
    id: option.id,
    content: (
      <TouchableWithoutFeedback
        onPress={() => onOptionPress(option.id)}
        disabled={option.disabled}>
        <View style={styles.optionContentContainer}>
          {option.disabled ? (
            disabledCheckboxIcon
          ) : (
            <CheckBox
              value={checkboxStates.get(option.id)}
              style={styles.checkbox}
              tintColors={{true: Color.blue, false: Color.lightGray}}
              onValueChange={(newVal: boolean) => {
                checkboxStates.set(option.id, newVal);
              }}
            />
          )}
          {option.content}
        </View>
      </TouchableWithoutFeedback>
    ),
  }));
}
