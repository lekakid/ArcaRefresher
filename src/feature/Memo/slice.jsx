import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { MODULE_ID } from './ModuleInfo';

const USER_MEMO = { key: 'userMemo', defaultValue: {} };

const initialState = {
  memo: getValue(USER_MEMO),
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
      setValue(USER_MEMO, state.memo);
    },
    setMemoList(state, action) {
      state.memo = action.payload;
      setValue(USER_MEMO, action.payload);
    },
  },
});

export const { setMemo, setMemoList } = slice.actions;

export default slice.reducer;
