import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@material-ui/core';

import { shiftSnack } from './slice';
import Info from './FeatureInfo';

export default function ContextSnack() {
  const dispatch = useDispatch();
  const { snackBag } = useSelector((state) => state[Info.ID]);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(undefined);

  useEffect(() => {
    if (snackBag.length && !snack) {
      dispatch(shiftSnack());
      if (!snackBag[0]) return;

      // mui에 clickaway onClose 이후 clickaway가 바로 터지는 버그가 있음
      setTimeout(() => {
        const next = { ...snackBag[0] };
        setSnack(next);
        setOpen(true);
      }, 50);
    }
    if (snackBag.length && snack && open) {
      setOpen(false);
    }
  }, [dispatch, open, snack, snackBag]);

  const handleSnackClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleExit = useCallback(() => {
    setSnack(undefined);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={snack?.time}
      onClose={snack?.time && handleSnackClose}
      message={snack?.msg}
      TransitionProps={{ onExited: handleExit }}
    />
  );
}
