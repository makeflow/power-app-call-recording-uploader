import {Alert, DeviceEventEmitter, NativeModules} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import Permissions from 'react-native-permissions';
import {initStore} from 'rlax';
import {Storage} from './data';
import {handleNewRecordFileEvent} from './device-event-handlers';
import {GlobalState, initStoreData} from './store';

const exit = () => RNExitApp.exitApp();

async function setRecordFolderPath() {
  const dir = await Storage.get(Storage.Key.RecordFileDir);
  if (dir) {
    NativeModules.ComModule.setRecordFolderPath(dir);
  }
}

async function requestRequiredPermissions() {
  const READ_EXTERNAL_STORAGE =
    Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  const CAMERA = Permissions.PERMISSIONS.ANDROID.CAMERA;

  const cameraResult = await Permissions.request(CAMERA);

  if (cameraResult !== 'granted') {
    Alert.alert(
      '未获得相机权限',
      '应用需要相机权限扫描二维码，请在设置中允许应用使用相机',
      [{text: 'OK', onPress: exit}],
    );
  }

  const storageResult = await Permissions.request(READ_EXTERNAL_STORAGE);

  if (storageResult !== 'granted') {
    Alert.alert(
      '未获得读取手机存储权限',
      '应用需要读取手机存储以获得录音文件，请在设置中允许应用读取手机存储',
      [{text: 'OK', onPress: exit}],
    );
  }
}

function addDeviceEventListeners() {
  DeviceEventEmitter.addListener('NewRecordFile', handleNewRecordFileEvent);
}

async function init() {
  initStore({data: initStoreData, persist: 'none'});
  await requestRequiredPermissions();
  await setRecordFolderPath();
  addDeviceEventListeners();
  GlobalState.doneAppInit();
}

init();
