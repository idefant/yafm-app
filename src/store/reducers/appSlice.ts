import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  folderPath?: string;
  archiveMode: boolean;
  isBaseUnlocked: boolean;
};

const initialState: AppState = {
  archiveMode: false,
  isBaseUnlocked: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFolderPath(state, { payload: path }: PayloadAction<string>) {
      state.folderPath = path;
    },
    clearFolderPath(state) {
      state.folderPath = undefined;
    },
    setArchiveMode(state, { payload: archiveMode }: PayloadAction<boolean>) {
      state.archiveMode = archiveMode;
    },
    unlockBase(state) {
      state.isBaseUnlocked = true;
    },
    lockBase: () => initialState,
  },
});

export const { setFolderPath, clearFolderPath, setArchiveMode, unlockBase, lockBase } =
  appSlice.actions;

export default appSlice.reducer;
