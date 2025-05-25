import React, { useEffect } from "react";
import Sidebar from "./Sidebar";

import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { chatActions } from "../../redux/chatSlice";
import { rtnActions } from "../../redux/notifySlice";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../../utils/socketManager";
import { GoogleOAuthProvider } from '@react-oauth/google';

const MainLayout = () => {
  const { users, selectedUser } = useSelector((store) => store.author);
  const dispatch = useDispatch();

  useEffect(() => {
  if (users?._id) {
    const socket = connectSocket(users._id);
    console.log("Socket connected for user", users._id);

    socket.on("getOnlineUsers", (onlineUsers) => {
      dispatch(chatActions.setOnlineUsers(onlineUsers));
    });

    socket.on("newNotification", (notification) => {
      dispatch(rtnActions.setlikeNotification(notification));
    });

    socket.on("newMessage", (message) => {
      dispatch(rtnActions.addMessageNotification(message));
      console.log("message", message.senderID);
      if (selectedUser?._id !== message.senderID) {
        dispatch(rtnActions.setUnread({ senderID: message.senderID }));
      }
    });

    // Cleanup function
    return () => {
      
      socket.off("getOnlineUsers");
      socket.off("newNotification");
      socket.off("newMessage");

      disconnectSocket();
    };
  }
}, [users?._id, dispatch, selectedUser?._id]);


  return (
    <>
      <Sidebar />
      <div className="md:ml-[110px] min-h-full w-full bg-gray-50 dark:bg-gray-900">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
      <ToastContainer autoClose={3000} position="bottom-right" />
    </>
  );
};

export default MainLayout;
