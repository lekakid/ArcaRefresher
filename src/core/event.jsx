export const EVENT_AUTOREFRESH = 'AREVENT_AUTOREFRESH';
export const EVENT_COMMENT_REFRESH = 'AREVENT_COMMENTREFRESH';

const AREvent = {};

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
