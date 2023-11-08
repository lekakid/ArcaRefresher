import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pushSnack } from './slice';

export default function useContextSnack() {
  const dispatch = useDispatch();

  const setSnack = useCallback(
    (snack) => {
      dispatch(pushSnack(snack));
    },
    [dispatch],
  );

  return setSnack;
}
