import {File} from '@/models';
import {Color} from '@/themes/colors';
import {formatDate} from '@/utils';
import filesize from 'filesize';
import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RecordFileInfoProps} from './type';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  divide: {
    color: Color.lightGray,
  },

  filename: {
    fontWeight: 'bold',
  },

  info: {
    color: Color.gray,
    fontSize: 12,
    paddingVertical: 8,
    marginRight: 'auto',
  },

  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },

  notUploaded: {
    color: Color.blue,
  },

  uploading: {
    color: Color.yellow,
  },

  uploaded: {
    color: Color.green,
  },

  uploadFailed: {
    color: Color.red,
  },
});

export default function RecordFileInfo(props: RecordFileInfoProps) {
  const {name, size, mtime, status} = props.file;

  const formatedSize = filesize(size);
  const formatedMtime = formatDate(mtime);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.filename}>{name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.info}>
          {formatedSize} <Text style={styles.divide}>|</Text> {formatedMtime}
        </Text>
        {createStatusView(status)}
      </View>
    </View>
  );
}

const statusIconMap = {
  'not-uploaded': (
    <Ionicons name="information-circle-sharp" size={16} color={Color.blue} />
  ),

  uploading: (
    <AnimatableView
      iterationCount="infinite"
      animation={{
        from: {transform: [{rotate: '0deg'}]},
        to: {transform: [{rotate: '360deg'}]},
      }}
      easing="linear">
      <MaterialCommunityIcons name="loading" size={15} color={Color.yellow} />
    </AnimatableView>
  ),

  uploaded: (
    <Ionicons name="checkmark-circle-sharp" size={15} color={Color.green} />
  ),

  'upload-failed': (
    <Ionicons name="close-circle-sharp" size={15} color={Color.red} />
  ),
};

const statusTextMap = {
  'not-uploaded': '等待确认',
  uploading: '正在上传',
  uploaded: '上传成功',
  'upload-failed': '上传失败',
};

function createStatusView(status: File['status']): JSX.Element {
  return (
    <View style={styles.statusView}>
      {statusIconMap[status]}
      <Text style={[styles.statusText, createStatusStyle(status)]}>
        {statusTextMap[status]}
      </Text>
    </View>
  );
}

function createStatusStyle(status: File['status']): StyleProp<TextStyle> {
  switch (status) {
    case 'not-uploaded':
      return styles.notUploaded;
    case 'uploading':
      return styles.uploading;
    case 'uploaded':
      return styles.uploaded;
    case 'upload-failed':
      return styles.uploadFailed;
    default:
      return null;
  }
}
