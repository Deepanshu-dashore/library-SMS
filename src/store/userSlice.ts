import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  currentUser: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUserSuccess: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUserStart, setUserSuccess, setUserFailure, logoutUser } = userSlice.actions;
export default userSlice.reducer;
