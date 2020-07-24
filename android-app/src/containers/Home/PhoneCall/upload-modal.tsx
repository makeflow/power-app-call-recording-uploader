import StyledButton from '@/components/StyledButton';
import {GlobalState} from '@/store';
import {Color} from '@/themes/colors';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
  const {show, uploadHandler, onClose} = props;
  const [percentage, setPercentage] = useState(0);

  const closeWithSuccess = () => onClose(true);
  const closeWithFailure = () => onClose(false);

  const cancel = () => {
    uploadHandler?.stop();
    closeWithFailure();
  };

  const onModalShow = () => {
    if (!uploadHandler) {
      return;
    }
    uploadHandler.progressEvent.subscribe(setPercentage);
    const files = uploadHandler.files;
    uploadHandler
      .start()
      .then((ok) => {
        if (ok) {
          files.forEach(GlobalState.setFileUploaded);
        }
      })
      .catch(() => {
        // TODO: 每个文件单独上传，从而可以具体获知是哪些文件没有上传成功
        files.forEach(GlobalState.setFileUploadFailed);
        // TODO: 上传失败后的提示
        closeWithFailure();
      });
  };

  const isDone = percentage >= 100;

  return (
    <Modal style={styles.modal} isVisible={show} onModalShow={onModalShow}>
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
