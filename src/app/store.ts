import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../features/ui/uiSlice'
import templatesReducer from '../features/templates/templatesSlice'
import plansReducer from '../features/plans/plansSlice'
import outcomesReducer from '../features/outcomes/outcomesSlice'
import classesReducer from '../features/classes/classesSlice'
import foldersReducer from '../features/folders/foldersSlice';
import clipboardReducer from '../features/clipboard/clipboardSlice';
import { persistMiddleware } from './storage'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    templates: templatesReducer,
    plans: plansReducer,
    outcomes: outcomesReducer,
    classes: classesReducer,
    folders: foldersReducer,
    clipboard: clipboardReducer,
  },
  middleware: (getDefault) => getDefault().concat(persistMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch