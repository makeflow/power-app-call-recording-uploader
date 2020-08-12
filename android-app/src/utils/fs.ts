import {File} from '@/models';
import RNFS from 'react-native-fs';

export async function readDir(path: string): Promise<File[]> {
  const files = await RNFS.readDir(path);
  return files.map(File.fromRNDirItem);
}

export function sortByMtime(files: File[]): File[] {
  return files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}
