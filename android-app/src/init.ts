import {DeviceEventEmitter, NativeModules} from 'react-native';
import {initStore} from 'rlax';
import {Storage} from './data';
import {handleNewRecordFileEvent} from './device-event-handlers';
import {GlobalState, initStoreData} from './store';

async function setRecordFolderPath() {
  const dir = await Storage.get(Storage.Key.RecordFileDir);
  if (dir) {
    NativeModules.ComModule.setRecordFolderPath(dir);
  }
}

function addDeviceEventListeners() {
  DeviceEventEmitter.addListener('NewRecordFile', handleNewRecordFileEvent);
}

async function init() {
  initStore({data: initStoreData, persist: 'none'});
  await setRecordFolderPath();
  addDeviceEventListeners();
  GlobalState.doneAppInit();
}

init();
