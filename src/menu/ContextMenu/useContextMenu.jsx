import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setContextSnack, setMenuOpen } from './slice';

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
      if (!msg) dispatch(setContextSnack({ open: false }));
      dispatch(setContextSnack({ open: true, msg, time }));
    },
    [dispatch],
  );

  return [setOpen, setSnack];
}
