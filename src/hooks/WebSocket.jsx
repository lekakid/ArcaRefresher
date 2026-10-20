import { unsafeWindow } from '$';
import { useCallback } from 'react';

const ARCA_HOST = 'arca.live';
const ARCA_PATHNAME = '/arcalive';

const modifierList = [];

const OriginWebSocket = unsafeWindow.WebSocket;
function WrappedWebSocket(url, protocols) {
  const { host, pathname } = new URL(url);
  if (host !== ARCA_HOST || pathname !== ARCA_PATHNAME) {
    // 아카라이브 이외의 경우 일반 소켓 제공
    return new OriginWebSocket(url, protocols);
  }

  const wrappedSocket = {
    ws: new OriginWebSocket(url, protocols),
    eventHistory: [],
    eventHistoryRecording: true,
    set onmessage(callback) {
      this.addEventListener.apply(this, ['message', callback, false]);
    },
    set onopen(callback) {
      this.addEventListener.apply(this, ['open', callback, false]);
    },
    set onclose(_) {
      // 사이트 기본 이벤트 무력화
    },
    addEventListener(event, eventCallback, options) {
      if (this.eventHistoryRecording) {
        this.eventHistory.push([event, eventCallback, options]);
      }

      if (event === 'message') {
        const wrappedCallback = (e) => {
          const token = e.data.split('|');
          const type = token[0];
          const originalData = token[1] ? JSON.parse(token[1]) : null;

          // 사이트 이벤트 전 처리
          let data = originalData;
          modifierList.forEach((callback) => {
            try {
              data = callback(type, data, originalData);
            } catch (error) {
              console.warn('[ArcaRefresher] WebSocket subscriber error', error);
            }
          });

          if (data === undefined) {
            console.warn('[WebSocket] return 잘못함');
          }

          // 비어있으면 이벤트 무시
          if (!data) return;

          // 이벤트 데이터 패치
          Object.defineProperty(e, 'data', {
            value: `${type}|${JSON.stringify(data)}`,
          });
          eventCallback.apply(this.ws, [e]);
        };
        this.ws.addEventListener.apply(this.ws, [
          event,
          wrappedCallback,
          options,
        ]);
        return;
      }
      this.ws.addEventListener.apply(this.ws, [event, eventCallback]);
    },
    send(data) {
      this.ws.send(data);
    },
    reconnect() {
      // 기존 소켓 종료 처리
      this.ws.close();

      // 소켓 교체
      this.ws = new OriginWebSocket(url, protocols);

      // 이벤트 재등록
      this.eventHistoryRecording = false;
      this.eventHistory.forEach((args) => this.addEventListener(...args));
      this.eventHistoryRecording = true;
    },
  };
  wrappedSocket.addEventListener('open', () => {
    console.info('[ArcaRefresher] Arcalive Websocket connected');
  });
  wrappedSocket.addEventListener('error', (e) => {
    console.warn('[ArcaRefresher] Arcalive Websocket error', e);
  });
  wrappedSocket.addEventListener('close', (e) => {
    if (e.target !== wrappedSocket.ws) return;

    setTimeout(() => {
      wrappedSocket.reconnect();
    }, 5000);
  });

  console.info('[ArcaRefresher] WebSocket Hooked');
  return wrappedSocket;
}
unsafeWindow.WebSocket = WrappedWebSocket;

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
export function useArcaSocket() {
  const subscribeSocket = useCallback((modifier) => {
    modifierList.push(modifier);
  }, []);

  const unsubscribeSocket = useCallback((modifier) => {
    modifierList.splice(modifierList.indexOf(modifier), 1);
  }, []);

  return { subscribeSocket, unsubscribeSocket };
}
