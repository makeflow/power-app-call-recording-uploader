import FolderSelector from '@/components/FolderSelector';
import Input from '@/components/Input';
import {Storage} from '@/data';
import {useVisibleEffect} from '@/hooks';
import {Color} from '@/themes/colors';
import React, {useState} from 'react';
import {NativeModules, StyleSheet, View} from 'react-native';
import {ExternalStorageDirectoryPath} from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

const folderIcon = <Icon name="folder-open" size={25} color={Color.yellow} />;

export default function Setting() {
  const [defaultRecordFolder, setDefaultRecordFolder] = useState<string>('');

  useVisibleEffect(() => {
    getRecordFolderPath().then(setDefaultRecordFolder);
  });

  const [chooseFolderMode, setChooseFolderMode] = useState(false);

  const onChooseFolderDone = (path: string) => {
    if (path === defaultRecordFolder) {
      return;
    }
    setRecordFolderPath(path).then(() => setDefaultRecordFolder(path));
  };

  const onChooseFolderCancel = () => {
    setChooseFolderMode(false);
  };

  const onRecordFolderPress = () => {
    setChooseFolderMode(true);
  };

  return (
    <View style={styles.container}>
      <FolderSelector
        path={ExternalStorageDirectoryPath}
        show={chooseFolderMode}
        onDone={onChooseFolderDone}
        onClose={onChooseFolderCancel}
      />
      <Input
        icon={folderIcon}
        label="录音文件夹位置"
        defaultValue={defaultRecordFolder}
        onPress={onRecordFolderPress}
      />
    </View>
  );
}

async function getRecordFolderPath(): Promise<string> {
  const path = await Storage.get(Storage.Key.RecordFileDir);
  return path || '';
}

async function setRecordFolderPath(path: string): Promise<void> {
  await Storage.set(Storage.Key.RecordFileDir, path);
  NativeModules.ComModule.setRecordFolderPath(path);
}
