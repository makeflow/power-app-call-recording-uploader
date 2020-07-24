export type Option<T> = {
  id: string;
  content: JSX.Element;
  value: T;
  selected?: boolean;
  disabled?: boolean;
};

export type Props<T> = {
  emptyNotice?: string;
  options?: Option<T>[];
  onSelect?: (values: T[]) => void;
  disabled?: boolean;
};
