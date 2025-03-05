import { createSlice } from "@reduxjs/toolkit";
const storedToken = localStorage.getItem("ownerToken") || ""; 
const storedOwnerData = localStorage.getItem("ownerData") || ""; 
const isOwnerAuthenticated = storedToken? true : false;

const initialState = {
  isOwnerAuth: isOwnerAuthenticated,
  ownerData: storedOwnerData,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    saveOwner: (state, action) => {
      if (localStorage.getItem("userToken")) return;
      state.isOwnerAuth = true;
      state.ownerData = action.payload;
      localStorage.setItem("ownerData", action.payload); 
      localStorage.setItem("ownerToken", action.payload.token);
    },
    clearOwner: (state) => {
      state.isOwnerAuth = false;
      state.ownerData = "";
      localStorage.removeItem("ownerData");
      localStorage.removeItem("ownerToken");
    },
  },
});

export const { saveOwner, clearOwner } = ownerSlice.actions;
export default ownerSlice.reducer;