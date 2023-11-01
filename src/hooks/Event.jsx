import { useCallback } from 'react';

export const EVENT_BOARD_REFRESH = 'AREVENT_BOARD_REFRESH';
export const EVENT_COMMENT_REFRESH = 'AREVENT_COMMENT_REFRESH';

const AREvent = {};

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
