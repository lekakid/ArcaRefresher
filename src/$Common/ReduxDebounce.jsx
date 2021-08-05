import { useDebounceCallback } from '@react-hook/debounce';

export default function useReduxDebounce(
  callback,
  wait = 300,
  leading = false,
) {
  return useDebounceCallback(callback, wait, leading);
}
