export const EVENT_AUTOREFRESH = 'AREVENT_AUTOREFRESH';
export const EVENT_COMMENT_REFRESH = 'AREVENT_COMMENTREFRESH';
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

export function addAREvent(event, callback) {
  if (!AREvent[event]) AREvent[event] = [];

  AREvent[event].push(callback);
}

export function removeAREvent(event, callback) {
  try {
    AREvent[event] = AREvent[event].filter((f) => f !== callback);
  } catch (error) {
    console.warn(error);
  }
}

export function dispatchAREvent(event) {
  try {
    AREvent[event].forEach((arEvent) => {
      arEvent();
    });
  } catch (error) {
    console.warn(error);
  }
}
