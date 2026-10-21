import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setOpacity } from '../slice';

export default function useBackdropOpacity() {
  const dispatch = useDispatch();
  const handler = useCallback(
    (value) => {
      dispatch(setOpacity(value));
    },
    [dispatch],
  );

  return handler;
}
