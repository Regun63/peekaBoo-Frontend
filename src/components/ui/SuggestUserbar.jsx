import React, {useState} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
const SuggestUserbar = () => {
  const { avatarColor } = useSelector((store) => store.color);
  const { suggestedUsers } = useSelector((store) => store.author);
  const { users } = useSelector((store) => store.author);

  return (
    <>
    <div className="flex sm:items-center items-end md:space-x-3">
      <Link
        to={`/peekaBoo/profile/${users?._id}`}
        className="flex ml-4 sm:ml-0 items-center  space-x-2"
      >
        <Avatar className="h-5 w-5 sm:h-10 sm:w-10 rounded-full border-2 border-purple-800 overflow-hidden">
          <AvatarImage
            src={users?.profilePicture}
            alt="Profile_Image"
            className="object-cover w-full h-full"
          />
          <AvatarFallback
            className={`flex pb-1 sm:pb-0 items-center justify-center max-w-[50px] font-medium text-white w-full sm:h-full rounded-full dark:text-gray-300 text-[12px] sm:text-base md:text-lg`}
            style={{ backgroundColor: avatarColor }}
          >
            {users?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="font-semibold text-xs truncate max-w-[150px] sm:text-[15px] text-gray-800 dark:text-gray-200">
            {users?.username || "Username"}
          </h1>
          <h2 className="text-gray-500 font-medium max-w-[150px]  truncate text-[10px] sm:text-sm">
            {users?.bio || "Bio here..."}
          </h2>
        </div>
      </Link>

    
      
    </div>
     <div className="flex justify-start gap-2 mt-3">
      <h1 className=" text-xs md:text-sm  text-gray-700 font-semibold "> suggested Users for you </h1>
      <p className="text-gray-500 text-xs md:text-sm font-semibold"> All</p>
     </div>
      {/* sugested users */}
    <div className="flex-col mt-10 space-y-3">
    {Array.isArray(suggestedUsers) && suggestedUsers.map((user) =>user?._id!==users?._id ? (
      <div key={user?._id} className="flex sm:items-center items-end md:space-x-2">
        <Link
          to={`/peekaBoo/profile/${user?._id}`}
          className="flex ml-4 sm:ml-0 items-center  space-x-2"
        >
          <Avatar className="h-5 w-5 sm:h-10 sm:w-10 rounded-full border-2 border-purple-800 overflow-hidden">
            <AvatarImage
              src={user?.profilePicture}
              alt="Profile_Image"
              className="object-cover w-full h-full"
            />
            <AvatarFallback
              className={`flex pb-1 sm:pb-0 items-center justify-center font-medium text-white w-full sm:h-full rounded-full dark:text-gray-300 text-[12px] sm:text-base md:text-lg`}
              style={{ backgroundColor: avatarColor }}
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center">
            <span className="font-semibold max-w-[150px]  truncate text-sm sm:text-base text-gray-800 dark:text-gray-200">
              {user?.username || "Username"}
            </span>
            <span className="text-gray-500  text-xs sm:text-sm truncate max-w-[150px]">
              {user?.bio || "Bio here..."}
            </span>
          </div>
          
        </Link>
        
      </div>
    ):null)}
  </div>
  </>
  );
};

export default SuggestUserbar;
