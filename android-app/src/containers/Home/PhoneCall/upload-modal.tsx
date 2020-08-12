import {UploadFileHandler, uploadFiles} from '@/api';
import StyledButton from '@/components/StyledButton';
import {Color} from '@/themes/colors';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {Circle as ProgressCircle} from 'react-native-progress';
import {UploadModalProps} from './type';

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    backgroundColor: Color.white,
    paddingTop: 30,
    paddingBottom: 20,
    borderRadius: 10,
    width: 260,
    alignItems: 'center',
  },

  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
    color: Color.black,
  },

  btn: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 70,
  },

  btnTitle: {
    fontSize: 13,
  },

  cancelBtn: {
    backgroundColor: Color.red,
  },

  returnBtn: {
    backgroundColor: Color.blue,
  },
});

export default function UploadModal(props: UploadModalProps) {
  const {show, files, onClose} = props;
  const [percentage, setPercentage] = useState(0);
  const [uploadHandler, setUploadHandler] = useState<UploadFileHandler>();

  const closeWithSuccess = () => onClose(true);
  const closeWithFailure = () => onClose(false);

  const start = () => {
    if (!uploadHandler) {
      return;
    }

    uploadHandler.progressEvent.subscribe(setPercentage);

    uploadHandler.start().catch(() => {
      Alert.alert(
        '上传失败',
        '上传失败，可能是网络或者其他问题，请重试或联系管理员',
        [
          {text: '取消', onPress: closeWithFailure},
          {text: '重试', onPress: retry},
        ],
      );
    });
  };

  const cancel = () => {
    if (uploadHandler) {
      uploadHandler.stop();
      closeWithFailure();
    }
  };

  const retry = () => {
    if (uploadHandler) {
      setUploadHandler(uploadHandler.retry());
    }
  };

  useEffect(() => {
    if (files.length) {
      setUploadHandler(uploadFiles(files));
    }
  }, [files]);

  useEffect(start, [uploadHandler]);

  const isDone = percentage >= 100;

  return (
    <Modal style={styles.modal} isVisible={show}>
      <View style={styles.content}>
        <ProgressCircle
          size={110}
          thickness={7}
          showsText={true}
          progress={percentage / 100}
          strokeCap="round"
          indeterminate={percentage === 0}
          color={isDone ? Color.lightGreen : Color.yellow}
          borderWidth={0}
        />
        <Text style={styles.title}>{isDone ? '上传完成！' : '上传中...'}</Text>
        <StyledButton
          style={[styles.btn, isDone ? styles.returnBtn : styles.cancelBtn]}
          titleStyle={styles.btnTitle}
          title={isDone ? '返回' : '取消'}
          onPress={isDone ? closeWithSuccess : cancel}
        />
      </View>
    </Modal>
  );
}
