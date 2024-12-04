import { configureStore } from "@reduxjs/toolkit";
import selectedIndexReducer from "../features/slices/selectedIndex";
import modalReducer from "../features/slices/modalSlice";  // Nhập khẩu modalReducer

// import { adminApi } from "@/apis/adminApi";

export const store = configureStore({
  reducer: {
    modal: modalReducer, // Thêm modalReducer vào reducer của store
    
  },
  
});
