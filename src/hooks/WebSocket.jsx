import { useCallback } from 'react';

const callbackList = [];

const OriginWebSocket = unsafeWindow.WebSocket;
function WrappedWebSocket(...contructorArguments) {
  const ws = new OriginWebSocket(...contructorArguments);

  const originAddEventListener = ws.addEventListener;
  function wrappedAddEventListener(...propertyArguments) {
    if (propertyArguments[0] === 'message') {
      const originalCallback = propertyArguments[1];
      propertyArguments[1] = (e) => {
        callbackList
          .filter(({ type }) => type === 'before')
          .forEach(({ callback }) => {
            callback(e);
          });

        originalCallback.apply(this, [e]);

        callbackList
          .filter(({ type }) => type === 'after')
          .forEach(({ callback }) => {
            callback(e);
          });
      };
    }
    return originAddEventListener.apply(this, propertyArguments);
  }

  ws.addEventListener = wrappedAddEventListener;
  Object.defineProperty(ws, 'onmessage', {
    set(func) {
      wrappedAddEventListener.apply(this, ['message', func, false]);
    },
  });

  console.info('[ArcaRefresher] WebSocket Hooked');
  return ws;
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
