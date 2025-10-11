// features/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string | null;
  full_name?: string | null;
  role?: string | null;
  [key: string]: any; // For any extra fields from Supabase
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: any, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state: any) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
