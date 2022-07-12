import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  content: "",
  type: "",
};
let timer = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    set(state, action) {
      state = action.payload;
      return state;
    },
    clear(state, action) {
      state.content = "";
      state.type = "";
      return state;
    },
  },
});

export const { set, clear } = notificationSlice.actions;

export const setNotification = (content, type, time) => {
  return (dispatch) => {
    dispatch(set({ content: content, type: type }));
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      dispatch(clear());
    }, 1000 * time);
  };
};

export default notificationSlice.reducer;
