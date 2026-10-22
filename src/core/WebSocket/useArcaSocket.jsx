import { useCallback } from 'react';
import { modifierList } from './WebSocket';

/**
 * 사이트에서 제공하는 웹소켓 메세지 이벤트를 구독하는 훅입니다.  
 * 반환 값을 null로 보내면 사이트 이벤트를 무시하게 됩니다.
 *
 * @returns {{
 *   subscribeSocket : (modifier: (
 *        type: string,
 *        data: MessageEvent.data,
 *        originalData: Object
 *      ) => ModifiedData
 *    ) => void,
 *   unsubscribeSocket : (modifier: (
 *        type: string,
 *        data: MessageEvent.data,
 *        originalData: Object
 *     ) => ModifiedData
 *   ) => void,
 * }}
 */
export default function useArcaSocket() {
  const subscribeSocket = useCallback((modifier) => {
    modifierList.push(modifier);
  }, []);

  const unsubscribeSocket = useCallback((modifier) => {
    const index = modifierList.indexOf(modifier);
    if (index >= 0) modifierList.splice(index, 1);
  }, []);

  return { subscribeSocket, unsubscribeSocket };
}
