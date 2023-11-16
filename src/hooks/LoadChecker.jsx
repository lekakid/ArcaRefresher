import { createSlice } from '@reduxjs/toolkit';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const HOOK_NAME = 'LoadChecker';
const PENDING = 'pending';
const FULFILLED = 'fulfilled';

const slice = createSlice({
  name: HOOK_NAME,
  initialState: {},
  reducers: {
    setPending(state, action) {
      const selector = action.payload;
      state[selector] = PENDING;
    },
    setFullfiled(state, action) {
      const selector = action.payload;
      state[selector] = FULFILLED;
    },
  },
});
const { setPending, setFullfiled } = slice.actions;
export const LoadCheckerReducerEntrie = [HOOK_NAME, slice.reducer];

let onMutate;
const observer = new MutationObserver(() => {
  onMutate?.();
});
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

export function useLoadChecker(targetSelector) {
  const dispatch = useDispatch();

  const loadTable = useSelector((state) => state[HOOK_NAME]);

  // loadTable 반영
  useLayoutEffect(() => {
    onMutate = () => {
      Object.entries(loadTable).forEach(([selector, loaded]) => {
        if (loaded === FULFILLED) return;

        if (document.querySelector(selector)) {
          dispatch(setFullfiled(selector));
        }
      });
    };
  }, [dispatch, loadTable]);

  // 로드 확인
  useLayoutEffect(() => {
    // 로드 됨
    if (loadTable[targetSelector] === FULFILLED) return;

    // 이미 로드 됨
    if (document.querySelector(targetSelector)) {
      dispatch(setFullfiled(targetSelector));
      return;
    }

    // 이미 대기 중
    if (loadTable[targetSelector] === PENDING) return;

    // 대기
    dispatch(setPending(targetSelector));
  }, [loadTable, targetSelector, dispatch]);

  return loadTable[targetSelector] === FULFILLED;
}
