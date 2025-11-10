import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  status: 'idle' | 'loading' | 'succeeded';
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus(state, action: PayloadAction<'idle' | 'loading' | 'succeeded'>) {
        state.status = action.payload;
    },
    setUser(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setAuthStatus, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;