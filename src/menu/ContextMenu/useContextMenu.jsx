import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addTrigger, removeTrigger } from './slice';

/**
 * 컨텍스트 메뉴를 등록함
 *
 * @param {string}   props.key            구분 키(보통 FeatureInfo.id)
 * @param {string}   props.selector       클릭된 엘리먼트를 기준으로 실제로 찾을 엘리먼트
 * @param {function} props.dataExtractor  클릭된 엘리먼트에서 데이터를 추출하는 함수
 * @param {Array}    deps                 함수를 재등록할 디펜던시
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

  return data;
}
