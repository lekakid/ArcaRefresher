import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addTrigger, removeTrigger, setOpen } from './slice';

/**
 * 컨텍스트 메뉴를 등록함
 *
 * @param {string} key              구분 키(보통 FeatureInfo.id)
 * @param {string} selector         클릭된 엘리먼트를 기준으로 실제로 찾을 엘리먼트
 * @returns
 */
export default function useContextMenu({ key, selector, dataExtractor }, deps) {
  const dispatch = useDispatch();
  useEffect(() => {
    const trigger = { key, selector };
    dispatch(addTrigger(trigger));

    return () => dispatch(removeTrigger(trigger));
  }, [dispatch, key, selector]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(dataExtractor, deps);

  const closeMenu = useCallback(() => {
    dispatch(setOpen(null));
  }, [dispatch]);

  return [data, closeMenu];
}
