export const getUserDataFromLocal = () => ({
  userId: localStorage.getItem("userID"),
  role: localStorage.getItem("role"),
});
