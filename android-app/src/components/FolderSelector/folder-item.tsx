import {Color} from '@/themes/colors';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {FolderItemProps} from './type';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 25,
  },

  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  icon: {
    marginRight: 10,
  },
});

const folderIcon = (
  <Icon name="folder-open" size={25} color={Color.yellow} style={styles.icon} />
);

export default function FolderItem(props: FolderItemProps) {
  const {folder, onPress} = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {folderIcon}
        <Text style={styles.name}>{folder.name}</Text>
      </View>
    </TouchableOpacity>
  );
}
