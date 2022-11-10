import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pushSnack } from './slice';

export default function useContextSnack() {
  const dispatch = useDispatch();

  const setSnack = useCallback(
    ({ msg, time }) => {
      dispatch(pushSnack({ msg, time }));
    },
    [dispatch],
  );

  return setSnack;
}
