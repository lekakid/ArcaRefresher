import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from './slice';
import { MODULE_ID } from './ModuleInfo';

export default function useContextMenu({ trigger, dataGetter }) {
  const dispatch = useDispatch();
  const {
    config: { enabled },
  } = useSelector((state) => state[MODULE_ID]);
  const [data, setData] = useState(null);
  const mouseInfo = useRef({ right: false, count: 0 });

  useEffect(() => {
    if (!enabled) return null;

    const handleDown = ({ button }) => {
      if (button === 2) mouseInfo.current.right = true;
    };
    const handleUp = ({ button }) => {
      if (button === 2) mouseInfo.current.right = false;
    };
    const handleMove = () => {
      if (mouseInfo.current.right) mouseInfo.current.count += 1;
    };

    const handleContext = (e) => {
      if (e.shiftKey) return;
      if (mouseInfo.current.count > 20) {
        mouseInfo.current.count = 0;
        return;
      }

      if (!trigger(e)) {
        setData(null);
        return;
      }

      e.preventDefault();
      setData(dataGetter(e));
      dispatch(setOpen());
    };

    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('contextmenu', handleContext);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('contextmenu', handleContext);
    };
  }, [dataGetter, dispatch, enabled, trigger]);

  return data;
}
