// src/features/slices/modalSlice.js

const initialState = {
  isOpen: false, // trạng thái mặc định của modal
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, isOpen: true };
    case "CLOSE_MODAL":
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export default modalReducer;
