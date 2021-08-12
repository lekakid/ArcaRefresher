import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

const ENABLED = { key: 'useContextMenu', defaultValue: true };

const initialState = {
  enabled: getValue(ENABLED),
  menuList: [],
  open: false,
  mousePos: [0, 0],
  eventType: null,
  data: null,
  snack: '',
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
    setContextOpen(state, action) {
      state.open = action.payload;
    },
    setContextEvent(state, action) {
      state.mousePos = action.payload.mousePos;
      state.eventType = action.payload.eventType;
      state.data = action.payload.data;
      state.open = true;
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
  setContextOpen,
  setContextEvent,
  setContextSnack,
} = slice.actions;

export default slice.reducer;