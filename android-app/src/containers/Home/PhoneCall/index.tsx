import {doneUploadFileSession, uploadFile} from '@/api';
import {UploadFileHandler} from '@/api/type';
import MultipleSelect from '@/components/MultipleSelect';
import {Option} from '@/components/MultipleSelect/type';
import StyledButton from '@/components/StyledButton';
import {File} from '@/models';
import {useGotoScan} from '@/routes';
import {GlobalState, GlobalStoreKey} from '@/store';
import {Color} from '@/themes/colors';
import {doNothing, showError} from '@/utils';
import {systemPhoneCall} from '@/utils/android';
import React, {useEffect, useState} from 'react';
import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from 'rlax';
import RecordFileInfo from './record-file-info';
import {OperationMode} from './type';
import UploadModal from './upload-modal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  box: {
    marginTop: 20,
    backgroundColor: Color.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: Color.lightGray,
  },

  boxTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 5,
  },

  boxTitle: {
    color: Color.gray,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordFileList: {
    flex: 1,
    marginBottom: 20,
  },

  recordFileSelectContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  infoIconContainer: {
    marginRight: 10,
  },

  infoTextContainer: {
    flex: 1,
  },

  infoTextView: {
    fontSize: 18 * PixelRatio.getFontScale(),
    fontWeight: 'bold',
  },

  btn: {
    height: 50,
    borderRadius: 25,
    marginBottom: 15,
    marginTop: 'auto',
  },

  callBtn: {
    backgroundColor: Color.blue,
  },

  callingBtn: {
    backgroundColor: Color.red,
  },

  uploadBtn: {
    backgroundColor: Color.green,
  },

  uploadingBtn: {
    backgroundColor: Color.yellow,
  },

  notice: {
    marginTop: 10,
    color: Color.gray,
  },
});

const listIcon = <Icon name="list-circle" size={30} color={Color.yellow} />;

const infoIcon = (
  <Icon name="information-circle-outline" size={50} color={Color.lightGreen} />
);

export default function PhoneCall() {
  const currentPhoneCallInfo = GlobalState.getPhoneCallInfo();
  const {phone} = currentPhoneCallInfo;
  const gotoScan = useGotoScan();
  const [operationMode, setOperationMode] = useState<OperationMode>(
    OperationMode.CanCall,
  );

  const startCall = () => {
    systemPhoneCall(phone)
      .then(GlobalState.startPhoneCallTask)
      .then(() => setOperationMode(OperationMode.CanEndCall))
      .catch(showError);
  };

  const finishCall = () => {
    doneUploadFileSession()
      .then(GlobalState.stopPhoneCallTask)
      .catch(showError);

    gotoScan();
  };

  useEffect(() => {
    return () => {
      if (GlobalState.isInPhoneCallProcess()) {
        GlobalState.stopPhoneCallTask();
      }
    };
  }, []);

  const files: File[] = useStore(GlobalStoreKey.CurrentFiles);
  const options = filesToOptions(files);

  const canPerformManualUpload = files.some(fileUploadable);

  useEffect(() => {
    if (operationMode === OperationMode.Upload && !canPerformManualUpload) {
      setOperationMode(OperationMode.CanEndCall);
    }
  }, [canPerformManualUpload, operationMode]);

  const [selected, setSelected] = useState<string[]>([]);
  const onSelectChange = (newSelected: string[]) => {
    if (newSelected.length) {
      setOperationMode(OperationMode.Upload);
    } else if (GlobalState.isInPhoneCallProcess()) {
      setOperationMode(OperationMode.CanEndCall);
    } else {
      setOperationMode(OperationMode.CanCall);
    }
    setSelected(newSelected);
  };

  const [uploadHandler, setUploadHandler] = useState<UploadFileHandler>();
  const onModalClose = () => {
    setOperationMode(OperationMode.Upload);
  };

  const manualUpload = () => {
    setOperationMode(OperationMode.Uploading);
    const selectedFiles = files.filter(
      (file) => fileUploadable(file) && selected.includes(file.path),
    );
    if (!selectedFiles.length) {
      return;
    }
    const uploadFileHandler = uploadFile(selectedFiles);
    setUploadHandler(uploadFileHandler);
  };

  function createButtonTitle() {
    switch (operationMode) {
      case OperationMode.CanCall:
        return '开始通话';
      case OperationMode.CanEndCall:
        return '结束通话';
      case OperationMode.Upload:
      case OperationMode.Uploading:
      case OperationMode.Done:
        return `上传（${selected.length}个）`;
      default:
        return '';
    }
  }

  function createButtonOnPressHandler() {
    switch (operationMode) {
      case OperationMode.CanCall:
        return startCall;
      case OperationMode.CanEndCall:
        return finishCall;
      case OperationMode.Upload:
        return manualUpload;
      default:
        return doNothing;
    }
  }

  function createButtonStyle() {
    const style: StyleProp<ViewStyle>[] = [styles.btn];
    switch (operationMode) {
      case OperationMode.CanCall:
        style.push(styles.callBtn);
        break;
      case OperationMode.CanEndCall:
        style.push(styles.callingBtn);
        break;
      case OperationMode.Upload:
      case OperationMode.Uploading:
      case OperationMode.Done:
        style.push(styles.uploadBtn);
        break;
    }
    return style;
  }

  return (
    <View style={styles.container}>
      <UploadModal
        show={operationMode === OperationMode.Uploading}
        uploadHandler={uploadHandler}
        onClose={onModalClose}
      />
      <View style={[styles.box, styles.info]}>
        <View style={styles.infoIconContainer}>{infoIcon}</View>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTextView}>当前号码：{phone}</Text>
          <Text style={styles.notice}>
            注意记住开启通话录音，否则无法获取录音内容
          </Text>
        </View>
      </View>

      <View style={[styles.box, styles.recordFileList]}>
        <View style={styles.boxTitleContainer}>
          {listIcon}
          <Text style={styles.boxTitle}>通话录音列表</Text>
        </View>
        <View style={styles.recordFileSelectContainer}>
          <MultipleSelect
            emptyNotice="当前还没有通话记录哦~"
            options={options}
            onSelect={onSelectChange}
          />
        </View>
      </View>
      <StyledButton
        style={createButtonStyle()}
        title={createButtonTitle()}
        onPress={createButtonOnPressHandler()}
      />
    </View>
  );
}

function filesToOptions(files: File[]): Option<string>[] {
  return files.map<Option<string>>((file) => ({
    id: file.path,
    content: <RecordFileInfo file={file} />,
    value: file.path,
    disabled: !fileUploadable(file),
  }));
}

function fileUploadable({status}: File): boolean {
  return status === 'not-uploaded' || status === 'upload-failed';
}
