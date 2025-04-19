import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    isModelOpen: false, //default value
  },
  reducers: {
    openModel: (state, action) => {
      console.log("action", action.payload);
      state.isModelOpen = action.payload;
    },
    closeModel: (state, action) => {
      state.isModelOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { closeModel, openModel } = commonSlice.actions;

export default commonSlice.reducer;
