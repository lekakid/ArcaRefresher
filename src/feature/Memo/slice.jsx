import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  variant: 'badge',
  memo: {},
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setVariant(state, action) {
      state.variant = action.payload;
      setValue(Info.ID, state);
    },
    setMemo(state, action) {
      const { user, memo } = action.payload;
      if (memo) {
        state.memo[user] = memo;
      } else {
        delete state.memo[user];
      }
      setValue(Info.ID, state);
    },
    setMemoList(state, action) {
      state.memo = action.payload;
      setValue(Info.ID, state);
    },
  },
});

export const { setVariant, setMemo, setMemoList } = slice.actions;

export default slice.reducer;
