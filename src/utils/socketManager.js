// socketManager.js
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io("https://peekaboo-backend-sush.onrender.com", {
        auth: { userId },
          transports: ["websocket"],      
      
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
