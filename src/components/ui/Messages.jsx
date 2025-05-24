import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { MessageCircleCode } from "lucide-react";
import getAllMessages from "../../hooks/getAllMessages";
import usesocketRTM from "../../hooks/getAllMessages"; // This should likely be from another file

const Messages = ({ selectedUser }) => {
  getAllMessages(selectedUser);
  usesocketRTM();

  const { avatarColor } = useSelector((store) => store.color);
  const { messages } = useSelector((store) => store.chat);
  const bottomRef = useRef(null);
  const { users} = useSelector((store) => store.author);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
      {selectedUser ? (
        <>
          {/* Selected User Info */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center space-y-2 justify-center">
              <Avatar className="h-6 w-6 lg:h-13 lg:w-13 rounded-full border-2 border-blue-400 overflow-hidden">
                <AvatarImage
                  src={selectedUser?.profilePicture}
                  alt="Profile_Image"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback
                  className="flex items-center justify-center font-medium text-white w-full h-full rounded-full text-sm sm:text-md"
                  style={{ backgroundColor: avatarColor }}
                >
                  {selectedUser?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-[9px] lg:text-[15px] font-semibold truncate">
                {selectedUser?.username}
              </span>
              <Link to={`/profile/${selectedUser?._id}`}>
                <Button
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: { xs: "12px", md: "14px" },
                    px: { xs: 1, md: 2 },
                    py: 0.5,
                    marginX: { md: 2, xs: 1 },
                    borderColor: "#dbdbdb",
                    color: "#f0f0f0",
                    backgroundColor: "#6a8e8f",
                    "&:hover": {
                      backgroundColor: "#436e6f",
                      borderColor: "#1e3d58",
                    },
                  }}
                >
                  View Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col space-y-2">
            {messages &&
              messages.map((message) => {
                const isSender =
                  message.senderID?._id !== selectedUser?._id;

                return (
                  <div
                    key={message._id}
                    className={`flex items-end gap-1 ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isSender && (
                      <Avatar className="h-5 w-5 lg:h-9 lg:w-9 rounded-full border-2 border-blue-400 overflow-hidden">
                        <AvatarImage
                          src={message.senderID?.profilePicture}
                          alt="Profile_Image"
                          className="object-cover w-full h-full"
                        />
                        <AvatarFallback
                          className="flex items-center justify-center font-medium text-white w-full h-full rounded-full text-sm sm:text-lg"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {message.senderID?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-xs lg:max-w-md px-2 py-1 rounded-lg ${
                        isSender
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      <p className="text-sm lg:text-md font-semibold">
                        {message.message}
                      </p>
                      <p className="text-xs mt-1 text-right select-none">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {isSender && (
                      <Avatar className="h-5 w-5 lg:h-9 lg:w-9 rounded-full border-2 border-blue-400 overflow-hidden">
                        <AvatarImage
                          src={users?.profilePicture}
                          alt="Profile_Image"
                          className="object-cover w-full h-full"
                        />
                        <AvatarFallback
                          className="flex items-center justify-center font-medium text-white w-full h-full rounded-full text-sm sm:text-lg"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {message.senderID?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            <div ref={bottomRef} />
          </div>
        </>
      ) : (
        // No user selected view
        <div className="flex flex-col items-center justify-center h-full w-full text-center">
          <MessageCircleCode size={130} color="#057dcd" strokeWidth={1.5} />
          <h1 className="mt-4 text-lg lg:text-xl font-bold text-blue-900/90 max-w-xs md:max-w-lg">
            Your Messages
          </h1>
          <h1 className="mt-4 text-lg lg:text-xl text-gray-500/80 max-w-xs md:max-w-lg">
            Select a user from Chats to initiate chat
          </h1>
        </div>
      )}
    </div>
  );
};

export default Messages;
