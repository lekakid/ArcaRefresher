import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTrigger, pushSnack, setOpen } from './slice';

import Info from './FeatureInfo';

export default function useContextMenu(initTrigger) {
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state[Info.ID]);
  const [trigger] = useState(initTrigger);

  useEffect(() => {
    dispatch(addTrigger(trigger));
  }, [dispatch, trigger]);

  const closeMenu = useCallback(() => {
    dispatch(setOpen(false));
  }, [dispatch]);

  const setSnack = useCallback(
    ({ msg, time }) => {
      dispatch(pushSnack({ msg, time }));
    },
    [dispatch],
  );

  return [open, closeMenu, setSnack];
}
