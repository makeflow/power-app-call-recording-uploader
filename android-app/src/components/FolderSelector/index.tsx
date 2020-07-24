import {Color} from '@/themes/colors';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import StyledButton from '../StyledButton';
import FolderItem from './folder-item';
import {Folder, Props} from './type';

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    backgroundColor: Color.white,
    borderRadius: 10,
    width: 300,
    height: 550,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  header: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  btnBack: {
    backgroundColor: 'transparent',
  },

  currentPath: {
    maxWidth: 220,
    marginLeft: 10,
  },

  list: {},

  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },

  btn: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 100,
  },

  btnTitle: {
    fontSize: 14,
  },

  btnCancel: {
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.gray,
  },

  btnCancelTitle: {
    color: Color.gray,
  },

  btnConfirm: {
    backgroundColor: Color.blue,
  },

  btnConfirmTitle: {
    color: Color.white,
  },
});

const backIcon = <Icon name="arrow-back-circle" color={Color.blue} size={30} />;

export default function FolderSelector(props: Props) {
  const {show, onDone, onClose, path} = props;

  const [currentPath, setCurrentPath] = useState(path);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [currentPathFolders, setCurrentPathFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (show) {
      RNFS.readDir(currentPath)
        .then((items) =>
          items
            .filter((item) => item.isDirectory() && !item.name.startsWith('.'))
            .map((item) => ({path: item.path, name: item.name})),
        )
        .then(setCurrentPathFolders);
    }
  }, [show, currentPath]);

  const enterFolder = (nextPath: string) => {
    setPathHistory([...pathHistory, currentPath]);
    setCurrentPath(nextPath);
  };

  const onBack = () => {
    if (pathHistory.length) {
      const lastPath = pathHistory.pop()!;
      setCurrentPath(lastPath);
    }
  };

  const onConfirm = () => {
    onDone(currentPath);
    onClose();
  };

  return (
    <Modal style={styles.modal} isVisible={show}>
      <View style={styles.content}>
        <View style={styles.header}>
          <StyledButton
            style={styles.btnBack}
            title={backIcon}
            onPress={onBack}
          />
          <Text style={styles.currentPath}>{currentPath}</Text>
        </View>
        <FlatList
          style={styles.list}
          data={currentPathFolders}
          renderItem={({item}) => (
            <FolderItem folder={item} onPress={() => enterFolder(item.path)} />
          )}
          keyExtractor={(item) => item.path}
        />
        <View style={styles.btnContainer}>
          <StyledButton
            title="取消"
            onPress={onClose}
            titleStyle={[styles.btnTitle, styles.btnCancelTitle]}
            style={[styles.btn, styles.btnCancel]}
          />
          <StyledButton
            title="确定"
            onPress={onConfirm}
            titleStyle={[styles.btnTitle, styles.btnConfirmTitle]}
            style={[styles.btn, styles.btnConfirm]}
          />
        </View>
      </View>
    </Modal>
  );
}
