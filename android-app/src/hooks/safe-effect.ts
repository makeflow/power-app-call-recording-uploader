/* eslint-disable react-hooks/exhaustive-deps */
import {Dispatch, SetStateAction, useEffect} from 'react';

type SafeSetState = <T extends Dispatch<SetStateAction<S>>, S>(
  setState: T,
  state: S,
) => void;

export function useSafeEffect(
  cb: (safeSetState: SafeSetState) => void,
  dependencies?: any[],
): void {
  let unmounted = false;

  const safeSetState = (setState: any, val: any) => {
    if (unmounted) {
      return;
    }
    setState(val);
  };

  useEffect(() => {
    cb(safeSetState);

    return () => {
      unmounted = true;
    };
  }, dependencies);
}
