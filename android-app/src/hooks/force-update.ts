import {useState} from 'react';

export default function useForceUpdate() {
  const setValue = useState(0)[1];
  return () => setValue((value) => ++value);
}
