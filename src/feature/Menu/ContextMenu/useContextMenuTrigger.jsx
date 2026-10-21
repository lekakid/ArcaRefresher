import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTrigger, removeTrigger } from './slice';

/**
 * 컨텍스트 메뉴 트리거를 등록합니다.  
 * 트리거에 지정한 select에 가장 가까운 부모를 찾습니다.
 * 트리거 조건에 맞는 엘리먼트는 target props로 받습니다.
 *
 * @param {string}   triggerInfo.key            구분 키(보통 featureInfo.id 사용)
 * @param {string}   triggerInfo.selector       MouseEvent.target을 기준으로 찾을 부모의 설렉터
 */
export default function useContextMenuTrigger({ key, selector }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const trigger = { key, selector };
    dispatch(addTrigger(trigger));

    return () => dispatch(removeTrigger(trigger));
  }, [dispatch, key, selector]);
}
