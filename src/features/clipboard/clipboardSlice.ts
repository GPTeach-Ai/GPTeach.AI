import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClipboardState {
  itemId: string | null;
  itemType: 'plan' | 'folder' | null;
}

const initialState: ClipboardState = {
  itemId: null,
  itemType: null,
};

const clipboardSlice = createSlice({
  name: 'clipboard',
  initialState,
  reducers: {
    copyItem(state, action: PayloadAction<{ itemId: string; itemType: 'plan' | 'folder' }>) {
      state.itemId = action.payload.itemId;
      state.itemType = action.payload.itemType;
    },
    clearClipboard(state) {
      state.itemId = null;
      state.itemType = null;
    },
  },
});

export const { copyItem, clearClipboard } = clipboardSlice.actions;
export default clipboardSlice.reducer;