import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const initialState = {
  name: "",
  username: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser(state, action) {
      state.name = "";
      state.username = "";
      state.token = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const setupUser = (data) => {
  return (dispatch) => {
    const user = {
      name: data.name,
      username: data.username,
      token: data.token,
    };
    blogService.setToken(data.token);
    dispatch(setUser(user));
  };
};

export const clearUserSetup = () => {
  return (dispatch) => {
    window.localStorage.clear();
    dispatch(clearUser());
  };
};

export default userSlice.reducer;
