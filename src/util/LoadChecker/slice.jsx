import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const initialState = {
  loadMap: {},
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    addPending(state, action) {
      state.loadMap[action.payload] = false;
    },
    setFullfiled(state, action) {
      state.loadMap[action.payload] = true;
    },
  },
});

export const { addPending, setFullfiled } = slice.actions;

export default slice.reducer;
