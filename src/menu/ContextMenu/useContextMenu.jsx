import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from './slice';
import { MODULE_ID } from './ModuleInfo';

export default function useContextMenu({ trigger, dataGetter }) {
  const dispatch = useDispatch();
  const {
    config: { interactionType },
  } = useSelector((state) => state[MODULE_ID]);
  const [data, setData] = useState(null);
  const mouseInfo = useRef({ right: false, count: 0 });

  useEffect(() => {
    const handleDown = ({ button }) => {
      if (button === 2) mouseInfo.current.right = true;
    };
    const handleUp = ({ button }) => {
      if (button === 2) mouseInfo.current.right = false;
    };
    const handleMove = () => {
      if (mouseInfo.current.right) mouseInfo.current.count += 1;
    };

    const handleMenu = {
      r(e) {
        if (mouseInfo.current.count > 20) {
          mouseInfo.current.count = 0;
          return;
        }
        if (e.shiftKey) return;

        if (!trigger(e)) {
          setData(null);
          return;
        }

        e.preventDefault();
        setData(dataGetter(e));
        dispatch(setOpen());
      },
      sr(e) {
        if (mouseInfo.current.count > 20) {
          mouseInfo.current.count = 0;
          return;
        }
        if (!e.shiftKey) return;

        if (!trigger(e)) {
          setData(null);
          return;
        }

        e.preventDefault();
        setData(dataGetter(e));
        dispatch(setOpen());
      },
    };

    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('contextmenu', handleMenu[interactionType]);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('contextmenu', handleMenu[interactionType]);
    };
  }, [dataGetter, dispatch, interactionType, trigger]);

  return data;
}
