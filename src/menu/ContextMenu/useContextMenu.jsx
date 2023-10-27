import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTrigger, removeTrigger, setOpen } from './slice';

import Info from './FeatureInfo';

/**
 * 컨텍스트 메뉴를 등록함
 *
 * @param {Ref} targetRef           prop으로 받은 targetRef를 그대로 받습니다.
 * @param {string} selector         클릭된 엘리먼트를 기준으로 실제로 찾을 자신을 포함한 부모를 검색해 원하는 타겟을 찾습니다.
 * @param {function} dataExtractor  찾은 타겟을 기준으로 데이터를 추출할 함수를 찾습니다.
 * @returns
 */
export default function useContextMenu({ targetRef, selector, dataExtractor }) {
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state[Info.ID]);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    dispatch(addTrigger(selector));

    return () => dispatch(removeTrigger(selector));
  }, [dispatch, selector]);

  useEffect(() => {
    if (!open) {
      setData(undefined);
      return;
    }

    // 실질적으로 클릭한 대상 검색
    const target = targetRef.current.closest(selector);
    if (!target) return;

    setData(dataExtractor(target));

    // dataExtractor가 무조건 한 번 사용하므로 deps에 추가하지 않아도 됨
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selector, targetRef]);

  const closeMenu = useCallback(() => {
    dispatch(setOpen(false));
  }, [dispatch]);

  return [data, closeMenu];
}
