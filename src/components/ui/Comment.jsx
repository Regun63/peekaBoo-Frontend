import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector, useDispatch } from "react-redux";
import { colorActions } from "../../redux/colorSlice";

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const { avatarColor } = useSelector((store) => store.color);

  return (
    <div className="w-full px-3 py-3 border-b border-gray-200/50 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${comment?.author?._id}`}>
          <Avatar className="h-10 w-10 sm:h-11 sm:w-11">
            <AvatarImage
              src={comment?.author?.profilePicture}
              alt="Profile"
              className="rounded-full object-cover h-10 w-10 border-2 border-blue-500"
            />
            <AvatarFallback
              className="flex items-center justify-center rounded-full text-white font-medium text-sm"
              style={{
                backgroundColor: avatarColor,
                height: 40,
                width: 40,
              }}
            >
              {comment?.author?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Username and Comment */}
        <div className="flex flex-col">
          <Link
            to={`/profile/${comment?.author?._id}`}
            className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
          >
            {comment?.author?.username || "Username"}
          </Link>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-all whitespace-pre-wrap">
            {comment?.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
