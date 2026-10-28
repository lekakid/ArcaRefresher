import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setOpacity } from './slice';

export default function useTransparency() {
  const dispatch = useDispatch();
  const handler = useCallback(
    (value) => {
      dispatch(setOpacity(value));
    },
    [dispatch],
  );

  return handler;
}
