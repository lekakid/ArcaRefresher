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
          Object.defineProperties(e, {
            data: { value: e.data, writable: true },
            ignore: { value: false, writable: true },
          });

          modifierList
            .filter(({ type }) => type === 'before')
            .forEach(({ callback }) => {
              try {
                callback(e);
              } catch (error) {
                console.warn(
                  '[ArcaRefresher] WebSocket subscriber error',
                  error,
                );
              }
            });

          if (!e.ignore) {
            eventCallback.apply(this.ws, [e]);
          }
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

export function useArcaSocket() {
  const subscribe = useCallback((modifier) => {
    modifierList.push(modifier);
  }, []);

  const unsubscribe = useCallback((modifier) => {
    modifierList.splice(modifierList.indexOf(modifier), 1);
  }, []);

  return [subscribe, unsubscribe];
}
