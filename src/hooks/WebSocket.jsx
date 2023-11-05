import { useCallback } from 'react';

const callbackList = [];

const OriginWebSocket = unsafeWindow.WebSocket;
function WrappedWebSocket(...contructorArguments) {
  console.info('[ArcaRefresher] WebSocket Wrapped');

  const ws = new OriginWebSocket(...contructorArguments);

  const originAddEventListener = ws.addEventListener;
  function wrappedAddEventListener(...propertyArguments) {
    if (propertyArguments[0] === 'message') {
      const callback = propertyArguments[1];
      propertyArguments[1] = (e) => {
        let result = e;
        callbackList?.forEach((c) => {
          result = c(e);
        });

        if (!result) return undefined;
        return callback.apply(this, [e]);
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

  return ws;
}
unsafeWindow.WebSocket = WrappedWebSocket;

export function useArcaSocket() {
  const subscribe = useCallback((callback) => {
    callbackList.push(callback);
  }, []);

  const unsubscribe = useCallback((callback) => {
    callbackList.splice(callbackList.indexOf(callback), 1);
  }, []);

  return [subscribe, unsubscribe];
}
