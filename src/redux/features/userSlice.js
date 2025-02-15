import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUserAuth: false,
    userData: {},
   
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.isUserAuth = true;
            state.userData = action.payload;
           
        },
        clearUser: (state) => {
            state.isUserAuth = false;
            state.userData = {};
           
        },
        setUser: (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = true;
            
          },
          loginUser: (state, action) => {
            state.isUserAuth = true;
            state.userData = action.payload;
          },
          logoutUser: (state) => {
            state.isUserAuth = false;
            state.userData = null;
          },
    },
});

export const { saveUser, clearUser , setUser,logoutUser} = userSlice.actions;

export default userSlice.reducer;