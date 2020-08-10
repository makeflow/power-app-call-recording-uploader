import {initStore} from 'rlax';
import {Storage} from './data';
import {setRecordFileFolder} from './native';
import {GlobalState, initStoreData} from './store';

async function initRecordFolderPath() {
  const dir = await Storage.get(Storage.Key.RecordFileDir);
  if (dir) {
    setRecordFileFolder(dir);
  }
}

async function init() {
  initStore({data: initStoreData, persist: 'none'});
  await initRecordFolderPath();
  GlobalState.doneAppInit();
}

init();
