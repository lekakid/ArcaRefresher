import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pushSnack, setMenuOpen } from './slice';

export default function useContextMenu() {
  const dispatch = useDispatch();

  const setOpen = useCallback(
    (open) => {
      dispatch(setMenuOpen(open));
    },
    [dispatch],
  );

  const setSnack = useCallback(
    ({ msg, time }) => {
      dispatch(pushSnack({ msg, time }));
    },
    [dispatch],
  );

  return [setOpen, setSnack];
}
