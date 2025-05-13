import { createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      loginSuccess: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        localStorage.clear();
      }
    },
  });
  
  export const { loginSuccess, logout, addChannelToUser, updateChannelInUser  } = authSlice.actions;
  export default authSlice.reducer;