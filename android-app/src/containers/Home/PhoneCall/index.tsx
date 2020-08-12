import MultipleSelect from '@/components/MultipleSelect';
import {Option} from '@/components/MultipleSelect/type';
import StyledButton from '@/components/StyledButton';
import {Storage} from '@/data';
import {File} from '@/models';
import {GlobalState, GlobalStoreKey} from '@/store';
import {Color} from '@/themes/colors';
import {doNothing, readDir, showError, sortByMtime} from '@/utils';
import {systemPhoneCall} from '@/utils/android';
import React, {useEffect, useState} from 'react';
import {
  PixelRatio,
  StyleProp,
  StyleSheet,
  Switch,
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

  switchLabel: {
    color: Color.gray,
    fontSize: 10,
    marginLeft: 'auto',
  },

  switch: {
    transform: [{scale: 0.9}],
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

  defaultBtn: {
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
  const [operationMode, setOperationMode] = useState<OperationMode>(
    OperationMode.Default,
  );
  const [manualSelectMode, setManualSelectMode] = useState(false);

  const startCall = () => {
    systemPhoneCall(phone)
      .then(GlobalState.startPhoneCallTask)
      .catch(showError);
  };

  useEffect(() => {
    return () => {
      if (GlobalState.isInPhoneCallProcess()) {
        GlobalState.stopPhoneCallTask();
      }
    };
  }, []);

  const [allFiles, setAllFiles] = useState<File[]>([]);
  const currentFiles: File[] = useStore(GlobalStoreKey.CurrentFiles);

  const createAllFileOptions = () => filesToOptions(allFiles, false);
  const createCurrentFileOptions = () => filesToOptions(currentFiles, true);

  const [selectedFilePaths, _setSelectedFilePaths] = useState<string[]>([]);
  const setSelectedFilePaths = (newSelected: string[]) => {
    if (newSelected.length) {
      setOperationMode(OperationMode.Upload);
    } else {
      setOperationMode(OperationMode.Default);
    }
    _setSelectedFilePaths(newSelected);
  };
  const onAllFileSelectChange = setSelectedFilePaths;
  const onCurrentFileSelectChange = setSelectedFilePaths;

  const onModalClose = () => {
    setOperationMode(OperationMode.Upload);
  };

  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const manualUpload = () => {
    const files = manualSelectMode ? allFiles : currentFiles;

    const selectedFiles = files.filter(
      (file) => fileUploadable(file) && selectedFilePaths.includes(file.path),
    );

    if (!selectedFiles.length) {
      return;
    }

    setFilesToUpload(selectedFiles);
    setOperationMode(OperationMode.Uploading);
  };

  function onManualSelectModeChange(manualSelect: boolean) {
    setManualSelectMode(manualSelect);
    setSelectedFilePaths([]);

    if (manualSelect) {
      Storage.get(Storage.Key.RecordFileDir).then((dir) => {
        if (dir) {
          readDir(dir).then(setAllFiles);
        }
      });
    }
  }

  function createButtonTitle() {
    switch (operationMode) {
      case OperationMode.Default:
        return manualSelectMode ? '选择上传' : '拨号';
      case OperationMode.Upload:
      case OperationMode.Uploading:
      case OperationMode.Done:
        return `上传（${selectedFilePaths.length}个）`;
      default:
        return '';
    }
  }

  function createButtonOnPressHandler() {
    switch (operationMode) {
      case OperationMode.Default:
        return manualSelectMode ? doNothing : startCall;
      case OperationMode.Upload:
        return manualUpload;
      default:
        return doNothing;
    }
  }

  function createButtonStyle() {
    const style: StyleProp<ViewStyle>[] = [styles.btn];
    switch (operationMode) {
      case OperationMode.Default:
        style.push(styles.defaultBtn);
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
        files={filesToUpload}
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
          <Text style={styles.switchLabel}>手动模式</Text>
          <Switch
            style={styles.switch}
            trackColor={{false: Color.lightGray, true: Color.green}}
            thumbColor={Color.white}
            value={manualSelectMode}
            onValueChange={onManualSelectModeChange}
          />
        </View>
        <View style={styles.recordFileSelectContainer}>
          {manualSelectMode ? (
            <MultipleSelect
              key="all-file-selector"
              emptyNotice="未找到任何通话录音"
              options={createAllFileOptions()}
              onSelect={onAllFileSelectChange}
            />
          ) : (
            <MultipleSelect
              key="current-file-selector"
              emptyNotice="当前还没有通话记录哦~"
              options={createCurrentFileOptions()}
              onSelect={onCurrentFileSelectChange}
            />
          )}
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

function filesToOptions(
  files: File[],
  showingState: boolean,
): Option<string>[] {
  return sortByMtime(files).map<Option<string>>((file) => ({
    id: file.path,
    content: <RecordFileInfo file={file} showingState={showingState} />,
    value: file.path,
    disabled: !fileUploadable(file),
  }));
}

function fileUploadable({status}: File): boolean {
  return status === 'not-uploaded' || status === 'upload-failed';
}
