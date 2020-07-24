import {useAppState} from '@react-native-community/hooks';
import {useIsFocused} from '@react-navigation/native';
import {useRef} from 'react';

export function useIsVisible(): boolean {
  const appState = useAppState();
  const isFocused = useIsFocused();
  if (appState === 'background' || !isFocused) {
    return false;
  }
  return true;
}

/** 当组件变为可见时触发回调，或者在组件可见的情况下，deps 中的变量发生变化也会触发回调 */
export function useVisibleEffect(cb: () => void, deps?: any[]): void {
  const isVisible = useIsVisible();
  const isLastTimeVisible = useRef(false);
  const oldDeps = useRef<any[]>([]);
  if (!isVisible) {
    isLastTimeVisible.current = false;
    return;
  }
  const isDepsChanged = depsChanged(oldDeps.current, deps);
  if (deps) {
    oldDeps.current = deps;
  }
  if (isDepsChanged || !isLastTimeVisible.current) {
    isLastTimeVisible.current = true;
    setImmediate(cb);
  }
}

function depsChanged(oldDeps: any[], newDeps?: any[]): boolean {
  if (typeof newDeps === 'undefined') {
    return false;
  }
  const len = oldDeps.length;
  for (let i = 0; i < len; i++) {
    if (!Object.is(oldDeps[i], newDeps[i])) {
      return true;
    }
  }
  return false;
}
