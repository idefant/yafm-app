import { createSlice } from '@reduxjs/toolkit';

type AppState = {
  counter: number;
};

const initialState: AppState = {
  counter: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    incrementCounter(state) {
      state.counter += 1;
    },
    decrementCounter(state) {
      state.counter -= 1;
    },
    lockBase: () => initialState,
  },
});

export const { incrementCounter, decrementCounter } = appSlice.actions;

export default appSlice.reducer;
