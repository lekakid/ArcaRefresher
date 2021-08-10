import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';

const USER_MEMO = { key: 'userMemo', defaultValue: {} };

const initialState = {
  memo: getValue(USER_MEMO),
  open: false,
};

export const slice = createSlice({
  name: 'Memo',
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
    setOpenDialog(state, action) {
      state.open = action.payload;
    },
  },
});

export const { setMemo, setMemoList, setOpenDialog } = slice.actions;

export default slice.reducer;
