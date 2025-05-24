import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { onlineUsers: [], messages: [], unread: [] },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    

    

  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;
