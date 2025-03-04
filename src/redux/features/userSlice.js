import { createSlice } from "@reduxjs/toolkit";

const storedUserData = localStorage.getItem("userData");
const isAuthenticated = storedUserData ? true : false;

const initialState = {
  userData: storedUserData || null,
  isUserAuth: isAuthenticated,
 
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      if (localStorage.getItem("ownerToken")) return;
      state.isUserAuth = true;
      state.userData = action.payload;
      localStorage.setItem("userData", action.payload);
    },

    clearUser: (state) => {
      state.isUserAuth = false;
      state.userData = null; 
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
    },

    setUser: (state, action) => {
      state.userData = action.payload;
      state.isUserAuth = true;
      localStorage.setItem("userData", action.payload);
    },

    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isUserAuth = true;
      localStorage.setItem("userData", action.payload);
    },

    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.userId = action.payload; 
      localStorage.setItem("userData",(action.payload)); 
    },

    logoutUser: (state) => {
      state.isUserAuth = false;
      state.userData = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
    },
  },
});

export const { saveUser, setUserData, clearUser, setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
