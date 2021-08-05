import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';

const ENABLED = { key: 'useContextMenu', defaultValue: true };

const initialState = {
  enabled: getValue(ENABLED),
  menuList: [],
};

export const contextMenuSlice = createSlice({
  name: 'ContextMenu',
  initialState,
  reducers: {
    setEnable(state, action) {
      state.enabled = action.payload;
      setValue(ENABLED, action.payload);
    },
    addContextMenu(state, action) {
      state.menuList.push(action.payload);
    },
  },
});

export const { setEnable, addContextMenu } = contextMenuSlice.actions;

export default contextMenuSlice.reducer;
