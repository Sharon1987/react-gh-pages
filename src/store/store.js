import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slice/messageSlice";
//import userReducer from "../slice/userSlice";
//import productReducer from "../slice/productSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    //user: userReducer,
    //product: productReducer,
  },
});

export default store;