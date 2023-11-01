import { useCallback } from 'react';

export const EVENT_BOARD_REFRESH = 'AREVENT_BOARD_REFRESH';
export const EVENT_COMMENT_REFRESH = 'AREVENT_COMMENT_REFRESH';
export const EVENT_ARCA_WS_MESSAGE = 'EVENT_ARCA_WS_MESSAGE';

const AREvent = {};

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
        AREvent[EVENT_ARCA_WS_MESSAGE]?.forEach((l) => {
          result = l(e);
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

export function useEvent() {
  const addListener = useCallback((type, callback) => {
    AREvent[type] ??= [];
    AREvent[type].push(callback);
  }, []);

  const removeListener = useCallback((type, callback) => {
    AREvent[type] ??= [];
    AREvent[type] = AREvent[type].filter((f) => f !== callback);
  }, []);

  return [addListener, removeListener];
}

export function useDispatchEvent() {
  const dispatchEvent = useCallback((type) => {
    try {
      AREvent[type].forEach((callback) => callback());
    } catch (error) {
      console.warn(error);
    }
  }, []);

  return dispatchEvent;
}
