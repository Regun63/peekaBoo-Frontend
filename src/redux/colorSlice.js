// src/redux/slices/colorSlice.js
import { createSlice } from "@reduxjs/toolkit";

const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#c084fc", "#0E9F6E", "#F17EB8", "#6B7280"];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const colorSlice = createSlice({
  name: "color",
  initialState: {
    avatarColor: getRandomColor()
  },
  reducers: {
    generateNewColor: (state) => {
      state.avatarColor = getRandomColor();
    }
  }
});

export const colorActions= colorSlice.actions;
export default colorSlice.reducer;
