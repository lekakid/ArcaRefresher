import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  memo: {},
};

const initialState = {
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setMemo(state, action) {
      const { user, memo } = action.payload;
      if (memo) {
        state.memo[user] = memo;
      } else {
        delete state.memo[user];
      }
      GM_setValue(MODULE_ID, state);
    },
    setMemoList(state, action) {
      state.memo = action.payload;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const { setMemo, setMemoList } = slice.actions;

export default slice.reducer;
