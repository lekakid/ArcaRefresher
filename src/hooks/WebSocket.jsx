import { useCallback } from 'react';

const callbackList = [];

const OriginWebSocket = unsafeWindow.WebSocket;
function WrappedWebSocket(...contructorArguments) {
  const wrappedSocket = {
    ws: new OriginWebSocket(...contructorArguments),
    eventHistory: [],
    eventHistoryRecording: true,
    pingCount: 0,
    set onmessage(callback) {
      this.addEventListener.apply(this, ['message', callback, false]);
    },
    set onopen(callback) {
      this.addEventListener.apply(this, ['open', callback, false]);
    },
    set onclose(callback) {
      // 이벤트 무력화
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

          if (e.data.split('|')[0] === 'c') {
            this.pingCount += 1;
          }

          callbackList
            .filter(({ type }) => type === 'before')
            .forEach(({ callback }) => {
              callback(e);
            });

          if (!e.ignore) {
            eventCallback.apply(this.ws, [e]);
          }

          callbackList
            .filter(({ type }) => type === 'after')
            .forEach(({ callback }) => {
              callback(e);
            });
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
      this.eventHistoryRecording = false;
      this.ws.close();
      this.ws = new OriginWebSocket(...contructorArguments);
      this.eventHistory.forEach((args) => this.addEventListener(...args));
      this.eventHistoryRecording = true;
    },
  };
  wrappedSocket.ws.onerror = (e) => {
    console.warn('[ArcaRefresher] Arcalive Websocket error', e);
    setTimeout(() => {
      wrappedSocket.reconnect();
    }, 2000);
  };
  setInterval(() => {
    // 약 8초에 한번 보내므로 1분에 7번까지는 받아야 정상
    if (wrappedSocket.pingCount < 5) {
      console.warn(
        `[ArcaRefresher] Arcalive Websocket disconnected (${new Date()})`,
      );
      wrappedSocket.reconnect();
    }
    wrappedSocket.pingCount = 0;
  }, 60000);

  console.info('[ArcaRefresher] WebSocket Hooked');
  return wrappedSocket;
}
unsafeWindow.WebSocket = WrappedWebSocket;

export function useArcaSocket() {
  const subscribe = useCallback((subscriber) => {
    callbackList.push(subscriber);
  }, []);

  const unsubscribe = useCallback((subscriber) => {
    callbackList.splice(callbackList.indexOf(subscriber), 1);
  }, []);

  return [subscribe, unsubscribe];
}
