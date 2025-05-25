import React, { useState, useEffect } from "react";
import {
  Home,
  UserSearch,
  TrendingUp,
  MessageCircle,
  Heart,
  LogOut,
  SquarePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Createpost from "./Createpost";
import { colorActions } from "../../redux/colorSlice";
import { rtnActions } from "../../redux/notifySlice";
import { authActions } from "../../redux/authorSlice";
import Button from "@mui/material/Button";

const Sidebar = () => {
  const { users } = useSelector((store) => store.author);
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");
  const [open, setOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [showBadgeChat, setShowBadgeChat] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const { avatarColor } = useSelector((store) => store.color);
  const { likeNotification, messageNotification } = useSelector(
    (store) => store.notify
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(colorActions.generateNewColor());
  }, [dispatch]);

  const sidebarContent = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <UserSearch />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <SquarePlus />,
      text: "New Post",
    },
    {
      icon: (
        <Avatar className="h-8 w-8 sm:h-15 sm:w-15 rounded-full">
          <AvatarImage
            src={users?.profilePicture}
            alt="Profile_Image"
            className="object-cover h-8 w-8 sm:h-15 sm:w-15 rounded-full"
          />
          <AvatarFallback
            className={`pt-2 dark:bg-gray-600 flex justify-center items-center text-white dark:text-gray-300 sm:text-sm`}
            style={{
              backgroundColor: avatarColor,
              borderRadius: 50,
              padding: users?.username ? "10px 15px" : "9px 7px",
              border: "2px solid purple",
            }}
          >
            {users?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut size={28} />,
      text: "Logout",
    },
  ];

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "https://peekaboo-mybackend.onrender.com/api/peekaBoo/user/logout",
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(authActions.setAuthUser(null))
        navigate("/login", {
          state: { message: res.data.message },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const profileHandler = async () => {
    try {
      const res = await axios.get(
        `https://peekaboo-mybackend.onrender.com/api/peekaBoo/user/profile/${users?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate(`/profile/${users?._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "User is not Authenticated");
    }
  };

  const sidebarHandler = (item) => {
    if (item.text === "Logout") {
      logoutHandler();
    } else if (item.text === "New Post") {
      setOpen(true);
    } else if (item.text === "Profile") {
      setActive(item.text);
      profileHandler();
    } else if (item.text === "Home") {
      setActive(item.text);
      setShowNotifications(false);
      navigate("/home");
    } else if (item.text === "Messages") {
      setActive(item.text);
      dispatch(rtnActions.clearMessageNotification([]));
      setShowNotifications(false);
      setShowBadgeChat(false);
      navigate("/message");
    } else if (item.text === "Notifications") {
      setActive(item.text);
      setShowNotifications((prev) => !prev);
      setShowBadge(false);
    } else {
      setActive(item.text);
      setShowNotifications(false);
    }
  };

  return (
    <section className="md:fixed md:left-0 md:top-0 md:h-screen xl:w-70 lg:w-60 md:w-48 bg-white dark:bg-gray-800 border-t-2 border-gray-100 md:border-t-0 md:border-r-2 w-full fixed bottom-0 z-50">
      <div className="hidden md:flex md:flex-col items-center ml-3 my-10 p-4">
        <div className="mb-8">
          <img
            className="h-12 w-12 rounded-full"
            src="https://media.istockphoto.com/id/1131321003/vector/white-bunny-rabbit-holding-wall-signboard-cute-cartoon-funny-animal-hiding-behind-paper.jpg?s=612x612&w=0&k=20&c=JLdEjmjJkW4cjZiAzSP3d0RzbY8wUZM28bHOQjjOnr8="
            alt="logo"
          />
        </div>
        <div className="w-full space-y-2">
          {sidebarContent.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                active === item.text
                  ? "bg-sky-200/70 text-blue-500 dark:bg-gray-200"
                  : "text-gray-700 hover:bg-sky-100/30 dark:text-gray-400 dark:hover:bg-gray-300"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>

              {item.text === "Notifications" &&
                Array.isArray(likeNotification) &&
                likeNotification.length > 0 &&
                showBadge && (
                  <div className="relative">
                    <div className="absolute -top-5 right-29 w-4 h-4 bg-red-500/90 text-white rounded-full text-xs flex items-center justify-center">
                      {likeNotification.length}
                    </div>
                  </div>
                )}

              {item.text === "Messages" &&
                Array.isArray(messageNotification) &&
                messageNotification.length > 0 &&
                showBadgeChat && (
                  <div className="relative">
                    <div className="absolute -top-5 right-24 w-4 h-4 bg-red-500/90 text-white rounded-full text-xs flex items-center justify-center">
                      {messageNotification.length}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2">
        {sidebarContent.map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item)}
            className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${
              active === item.text
                ? "text-blue-500"
                : "text-gray-600 hover:bg-sky-100/40 dark:text-gray-300 dark:hover:bg-gray-300"
            }`}
          >
            <span className="text-[14px]">{item.icon}</span>
          </div>
        ))}
      </div>

      <Createpost open={open} setOpen={setOpen} />

      {showNotifications && (
        <div className="fixed top-0 right-0 w-full sm:w-[22rem] h-full bg-white dark:bg-gray-900 shadow-xl z-50 border-l border-gray-300 p-4 transition-all flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-white">
              Notifications
            </h2>
            <button
              className="text-gray-500 hover:text-red-500"
              onClick={() => {
                setShowNotifications(false);
              }}
              aria-label="Close notifications panel"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto flex-grow pr-2">
            {likeNotification.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No new notifications
              </p>
            ) : (
              <>
                <Button
                onClick={()=>{
                  dispatch(rtnActions.clearNotification([]))
                }}
                  sx={{
                    backgroundColor: "skyblue",
                    color: "white",
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "#60a5fa",
                    },
                  }}
                >
                  Clear all
                </Button>
                {likeNotification.map((note, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100/70 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 shadow"
                  >
                    {note.message || "Someone liked your post!"}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Sidebar;
