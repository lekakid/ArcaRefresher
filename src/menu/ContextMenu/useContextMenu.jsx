import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from './slice';
import { MODULE_ID } from './ModuleInfo';

export default function useContextMenu({ trigger, dataGetter }) {
  const dispatch = useDispatch();
  const { enabled } = useSelector((state) => state[MODULE_ID]);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!enabled) return null;

    const handleContext = (e) => {
      if (!trigger(e)) {
        setData(null);
        return;
      }

      e.preventDefault();
      setData(dataGetter(e));
      dispatch(setOpen());
    };

    document.addEventListener('contextmenu', handleContext);
    return () => document.removeEventListener('contextmenu', handleContext);
  }, [dataGetter, dispatch, enabled, trigger]);

  return data;
}
