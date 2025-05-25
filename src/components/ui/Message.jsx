import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import SendIcon from "@mui/icons-material/Send";
import { authActions } from "../../redux/authorSlice";
import { rtnActions } from "../../redux/notifySlice";
import Messages from "./Messages";
import axios from "axios";
import { chatActions } from "../../redux/chatSlice";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";

const Message = () => {
  const { suggestedUsers } = useSelector((store) => store.author);
  const { selectedUser } = useSelector((store) => store.author);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const { unread } = useSelector((store) => store?.notify || {});
  const [showBadgeChat, setShowBadgeChat] = useState(true);
  const isOnline = onlineUsers.includes(selectedUser?._id);

  const [newText, setNewText] = useState("");

  const { avatarColor } = useSelector((store) => store.color);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    try {
      const res = await axios.post(
        `https://peekaboo-backend-2-49bc.onrender.com/api/peekaBoo/message/${selectedUser?._id}/send`,
        {
          message: newText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(
          chatActions.setMessages([...(messages || []), res.data.newMessage])
        );
        setNewText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(authActions.setSelectedUser(null));
    };
  }, []);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="lg:w-[32%] xl:ml-10 w-[36%] bg-sky-200/20 border-r border-sky-200/70 overflow-y-auto p-4">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        {suggestedUsers?.map((user) => {
          const isOnlineUsers = onlineUsers.includes(user?._id);
          return (
            <div
              key={user?._id}
              tabIndex={0}
              role="button"
              onClick={() => {
                dispatch(authActions.setSelectedUser(user));
                dispatch(rtnActions.clearUnread(user._id));
                setShowBadgeChat(false);
              }}
              onKeyDown={(e) => {
                if (e.key.toLowerCase() === "d") {
                  dispatch(authActions.setSelectedUser(null));
                }
              }}
              className={`flex items-center md:justify-center xl:justify-start gap-3 p-2 lg:ml-14 md:ml-18 ml-0 cursor-pointer focus-visible:ring-transparent  rounded-xl ${
                selectedUser?._id === user?._id
                  ? "bg-blue-300/80 hover:bg-blue-300/80"
                  : "hover:bg-sky-100/80"
              }`}
            >
              <Avatar className="h-6 w-6 lg:h-12 lg:w-12 rounded-full border-2 border-blue-400 overflow-hidden">
                <AvatarImage
                  src={user?.profilePicture}
                  alt="Profile_Image"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback
                  className="flex items-center justify-center font-medium text-white w-full h-full rounded-full dark:text-gray-300 text-sm sm:text-lg"
                  style={{ backgroundColor: avatarColor }}
                >
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex  items-center gap-1 md:gap-2 justify-start">
                <span className="text-[9px] lg:text-[15px] font-semibold md:text-md max-w-[80px] xl:max-w-none truncate xl:truncate-none">
                  {user?.username}
                </span>
                <div
                  className={`md:text-xs text-[6px] font-semibold ${
                    isOnlineUsers ? "text-green-600 " : "text-red-500"
                  }`}
                >
                  {isOnlineUsers ? "Online" : "Offline"}
                </div>

                {unread?.[user._id] > 0 && (
                  <div className="relative">
                    <div className="absolute -top-2 -right-6 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {unread[user._id]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Window */}

      <div className="flex-1 flex flex-col">
        {/* Header */}

        <div className="p-4 border-b border-gray-300 shadow-lg w-full h-16 flex items-center justify-between">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 lg:h-12 lg:w-12 rounded-full border-1 border-blue-400 overflow-hidden">
                  <AvatarImage
                    src={selectedUser?.profilePicture}
                    alt="Profile_Image"
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback
                    className="flex items-center justify-center font-medium text-white w-full h-full rounded-full dark:text-gray-300 text-sm sm:text-lg"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {selectedUser?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-col">
                  <span className="font-semibold">
                    {selectedUser?.username}
                  </span>
                  <div
                    className={`text-xs font-semibold text-start ${
                      isOnline ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
              <div className="mr-8 ">
                <CallOutlinedIcon className="text-gray-700  mr-3" />
                <VideoCameraFrontOutlinedIcon className="text-gray-700  " />
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>

        {/* Chat Messages */}
        <Messages selectedUser={selectedUser} />

        {/* Message Input */}
        {selectedUser && (
          <div className="p-4 md:mb-10 mb-30 flex items-center gap-2">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type a message..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9999px",
                  "& input": {
                    color: "gray",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage} edge="end">
                      <SendIcon sx={{ color: "blue" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
