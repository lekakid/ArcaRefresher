import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';

const USE_CONTEXT_MENU = { key: 'useContextMenu', defaultValue: true };

const initialState = {
  useContextMenu: getValue(USE_CONTEXT_MENU),
};

export const contextMenuSlice = createSlice({
  name: 'ContextMenu',
  initialState,
  reducers: {
    setUseContextMenu(state, action) {
      state.timeLimit = action.payload;
      setValue(USE_CONTEXT_MENU, action.payload);
    },
  },
});

export const { setUseContextMenu } = contextMenuSlice.actions;

export default contextMenuSlice.reducer;
