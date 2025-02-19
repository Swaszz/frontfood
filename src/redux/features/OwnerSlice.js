import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOwnerAuth: false,
  ownerData: null,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    saveOwner: (state, action) => {
      state.isOwnerAuth = true;
      state.ownerData = action.payload;
    },
    clearOwner: (state) => {
      state.isOwnerAuth = false;
      state.ownerData = null;
    },
  },
});

export const { saveOwner, clearOwner } = ownerSlice.actions;
export default ownerSlice.reducer;