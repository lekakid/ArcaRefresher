import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { MODULE_ID } from './ModuleInfo';

const ENABLED = { key: 'useContextMenu', defaultValue: true };

const initialState = {
  enabled: getValue(ENABLED),
  menuList: [],
  open: false,
  mousePos: [0, 0],
  data: {},
  snack: false,
  snackTime: null,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setEnable(state) {
      state.enabled = !state.enabled;
      setValue(ENABLED, state.enabled);
    },
    addContextMenu(state, action) {
      state.menuList.push(action.payload);
    },
    openContextMenu(state, action) {
      state.mousePos = action.payload.mousePos;
      state.data = action.payload.data;
      state.open = true;
    },
    closeContextMenu(state) {
      state.open = false;
    },
    setContextSnack(state, action) {
      const { msg, time } = action.payload;
      state.snack = msg;
      state.snackTime = time || null;
    },
  },
});

export const {
  setEnable,
  addContextMenu,
  openContextMenu,
  closeContextMenu,
  setContextSnack,
} = slice.actions;

export default slice.reducer;
