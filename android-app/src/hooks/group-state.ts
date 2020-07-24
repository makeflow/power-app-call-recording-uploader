import {useRef} from 'react';
import useForceUpdate from './force-update';

export type GroupState<T, U> = Map<T, U> & {
  updateMarker: number;
};

export function useGroupState<T, U>(): GroupState<T, U> {
  const updateRecordMap = new Map<T, U>() as GroupState<T, U>;
  updateRecordMap.updateMarker = 0;
  const states = useRef(updateRecordMap).current;
  const forceUpdate = useForceUpdate();

  const oldSet = states.set.bind(states);
  Reflect.defineProperty(states, 'set', {
    value: (id: T, newValue: U): GroupState<T, U> => {
      if (!states.has(id) || !Object.is(states.get(id), newValue)) {
        oldSet(id, newValue);
        states.updateMarker++;
        forceUpdate();
      }
      return states;
    },
  });

  return states;
}
