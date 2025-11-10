import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { Folder } from '../../lib/types';

interface FoldersState {
  items: Folder[];
}

const initialState: FoldersState = {
  items: [],
};

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    addFolder(state, action: PayloadAction<Folder>) {
        state.items.push(action.payload);
    },
    createFolder(state, action: PayloadAction<{ name: string; classId: string; parentId: string | null; color?: string }>) {
      const newFolder: Folder = {
        id: nanoid(),
        name: action.payload.name,
        classId: action.payload.classId,
        parentId: action.payload.parentId,
        createdAt: new Date().toISOString(),
        color: action.payload.color || '#fdba74' // Default orange pastel
      };
      state.items.push(newFolder);
    },
    updateFolder(state, action: PayloadAction<Partial<Folder> & { id: string }>) {
      const index = state.items.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    softDeleteFolder(state, action: PayloadAction<string>) {
        const folder = state.items.find(f => f.id === action.payload);
        if (folder) {
            folder.deletedAt = new Date().toISOString();
        }
    },
    restoreFolder(state, action: PayloadAction<string>) {
        const folder = state.items.find(f => f.id === action.payload);
        if (folder) {
            folder.deletedAt = null;
        }
    },
    deleteFolder(state, action: PayloadAction<string>) {
      state.items = state.items.filter(f => f.id !== action.payload);
    },
    duplicateFolder(state, action: PayloadAction<{ folderId: string }>) {
        const original = state.items.find(f => f.id === action.payload.folderId);
        if (original) {
            const newFolder: Folder = {
                ...original,
                id: nanoid(),
                name: `${original.name} Copy`,
                createdAt: new Date().toISOString(),
            };
            state.items.push(newFolder);
        }
    },
    moveFolder(state, action: PayloadAction<{ folderId: string; targetClassId: string; targetParentId: string | null }>) {
        const folder = state.items.find(f => f.id === action.payload.folderId);
        if (folder) {
            folder.classId = action.payload.targetClassId;
            folder.parentId = action.payload.targetParentId;
        }
    },
    pasteCopiedFolder(state, action: PayloadAction<{ sourceFolderId: string, targetClassId: string, targetParentId: string | null }>) {
        const original = state.items.find(f => f.id === action.payload.sourceFolderId);
        if (original) {
            const newFolder: Folder = {
                ...JSON.parse(JSON.stringify(original)), // Deep copy
                id: nanoid(),
                classId: action.payload.targetClassId,
                parentId: action.payload.targetParentId,
                createdAt: new Date().toISOString(),
            };
            state.items.push(newFolder);
        }
    }
  },
});

export const { addFolder, createFolder, updateFolder, deleteFolder, duplicateFolder, moveFolder, pasteCopiedFolder, softDeleteFolder, restoreFolder } = foldersSlice.actions;
export default foldersSlice.reducer;