import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Info from './FeatureInfo';
import { addPending } from './slice';

export default function useLoadChecker(targetSelector) {
  const dispatch = useDispatch();
  const { loadMap } = useSelector((state) => state[Info.ID]);

  useEffect(() => {
    if (loadMap[targetSelector] !== undefined) return;

    dispatch(addPending(targetSelector));
  }, [dispatch, loadMap, targetSelector]);

  return loadMap[targetSelector];
}
