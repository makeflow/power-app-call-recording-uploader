export type Props = {
  show: boolean;
  path: string;
  onDone: (path: string) => void;
  onClose: () => void;
};

export type Folder = {
  path: string;
  name: string;
};

export type FolderItemProps = {
  folder: Folder;
  onPress: () => void;
};
