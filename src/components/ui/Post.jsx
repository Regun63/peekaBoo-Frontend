import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IoIosShareAlt } from "react-icons/io";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import Modal from "@mui/material/Modal";
import { BsThreeDots } from "react-icons/bs";
import CommentBox from "./CommentBox";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import DeleteConfirm from "./DeleteConfirm";
import { postActions } from "../../redux/postSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Post = ({ post }) => {

  const dispatch = useDispatch();
  const { users } = useSelector((store) => store.author);
  const { posts } = useSelector((state) => state.post);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [input, setInput] = useState("");
  const [liked, setLiked] = useState(post.likes.includes(users?._id) || false);
  const [comment, setComment] = useState(post.comments);
  const [likedPost, setLikedPost] = useState(post.likes.length);
  const [bookmarked, setBookmarked] = useState(false );
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // store post to delete
  const { avatarColor } = useSelector((store) => store.color);
  const [isFollow, setIsFollow] = useState(users?.following?.includes(post?.author?._id));



  console.log(users?.bookmarks)


  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setOpenDel(true);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inputHandler = (e) => {
    const newInput = e.target.value;
    if (newInput.trim()) setInput(newInput);
    else setInput("");
  };

  useEffect(() => {
    if (users && post?.author) {
      setIsFollow(post?.author?.followers?.includes(users._id));
    }
  }, [post?.author, users]);

  const handleFollower = async () => {
    try {
      // Send request with the profile user's id (the one to follow/unfollow)
      const res = await axios.post(
        `https://peekaboo-mybackend.onrender.com/api/peekaBoo/user/follow_or_unfollow/${post?.author?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsFollow(res.data.following); 
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update follow status.");
    }
  };
  
  const handleLike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://peekaboo-mybackend.onrender.com/api/peekaBoo/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updateLikes = liked ? likedPost - 1 : likedPost + 1;
        setLikedPost(updateLikes);
        setLiked(!liked);
        console.log("Like response", res.data);
        const updatedPostData = posts.map((p) =>
          p._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== users._id)
                  : [...p.likes, users._id],
              }
            : p
        );

        dispatch(postActions.setUserPost(updatedPostData));
        toast(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const commentHandler = async () => {
    console.log("comment");
    try {
      const res = await axios.post(
        `https://peekaboo-mybackend.onrender.com/api/peekaBoo/post/${post?._id}/comment`,
        { input },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const newComment = res.data.comment;
      if (res.data.success) {
        console.log(newComment);
        const updateComment = [...comment, newComment];
        setComment(updateComment);

        const updateCommentData = posts.map((p) =>
          p._id === post?._id
            ? {
                ...p,
                comments: updateComment,
              }
            : p
        );

        dispatch(postActions.setUserPost(updateCommentData));
        toast.success(res.data.message);
        setInput("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleBookmark =async () => {
    
    try {
      const res = await axios.get(
        `https://peekaboo-mybackend.onrender.com/api/peekaBoo/post/${post?._id}/bookmark`,
       
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setBookmarked(res.data.bookmarked); 
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
      
    } catch (error) {
      toast.error(error.response.data.message||"Cannot save post!")
    }
  };

  const createdAt = new Date(post.createdAt);

  const formattedDate = format(createdAt, "MMMM dd, yyyy hh:mm a");
  return (
    <div className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center  space-x-2 sm:space-x-3">
            <Link
              to={`/profile/${post?.author?._id}`}
              className="flex items-center  space-x-2 sm:space-x-3"
            >
              <Avatar className="h-6 w-6 sm:h-10 sm:w-10  rounded-full border-2 border-purple-800 overflow-hidden">
                <AvatarImage
                  src={post?.author?.profilePicture}
                  alt="Profile_Image"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback
                  className={`flex pb-1 sm:pb-0 items-center  justify-center font-medium text-white w-full sm:h-full rounded-full dark:text-gray-300 text-[12px] sm:text-base md:text-lg`}
                  style={{
                    backgroundColor: avatarColor,
                    borderRadius: "9999px",
                  }}
                >
                  {post?.author?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <h1 className="font-semibold text-xs sm:text-[15px] text-gray-800 dark:text-gray-200">
                {post?.author?.username || "Username"}
              </h1>
              {post?.author?._id === users?._id && (
                <span className="bg-blue-100 text-blue-800  text-[7px] sm:text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  author
                </span>
              )}
              <h2 className="text-[6px] sm:text-xs text-gray-400 font-semibold">
                {formattedDate}
              </h2>
            </Link>
          </div>
          <Button onClick={handleOpen} className="p-1 sm:p-2">
            <BsThreeDots className="text-sm sm:text-base" />
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 400 },
                maxWidth: "90vw",
                bgcolor: "background.paper",
                border: 0,
                outline: "none",
                boxShadow: 24,
                p: { xs: 2, sm: 4 },
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              {post?.author?._id !== users?._id && (
                <Button
                onClick={handleFollower}
                  sx={{
                    backgroundColor: "#bcf0da",
                    "&:hover": { backgroundColor: "#84E1BC" },
                    color: "#1C64F2",
                    borderRadius: "9999px",
                    textTransform: "none",
                    fontWeight: 500,
                    width: "50%",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                 {isFollow?"Unfollow":"Follow"}
                </Button>
              )}

              {post?.author?._id === users?._id && (
                <Button
                  sx={{
                    backgroundColor: "#bcf0da",
                    "&:hover": { backgroundColor: "#84E1BC" },
                    color: "#1C64F2",
                    borderRadius: "9999px",
                    textTransform: "none",
                    fontWeight: 500,
                    width: "50%",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Edit
                </Button>
              )}
              {post?.author?._id !== users?._id && (
                <Button
                  sx={{
                    backgroundColor: "#bcf0da",
                    "&:hover": { backgroundColor: "#84E1BC" },
                    color: "#1C64F2",
                    borderRadius: "9999px",
                    textTransform: "none",
                    fontWeight: 500,
                    width: "50%",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Report
                </Button>
              )}

              {post?.author?._id === users?._id && (
                <Button
                  onClick={() => handleDeleteClick(post)}
                  sx={{
                    backgroundColor: "#bcf0da",
                    "&:hover": { backgroundColor: "#84E1BC" },
                    color: "#1C64F2",
                    borderRadius: "9999px",
                    textTransform: "none",
                    fontWeight: 500,
                    width: "50%",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: "#bcf0da",
                  "&:hover": { backgroundColor: "#84E1BC" },
                  color: "#1C64F2",
                  borderRadius: "9999px",
                  textTransform: "none",
                  fontWeight: 500,
                  width: "50%",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
      <img
        src={post?.image}
        alt="Post content"
        className="w-full max-h-[450px]  object-contain aspect-video rounded-md"
      />

      <div className="flex justify-between items-center p-4">
        <div className="flex gap-4">
          {liked ? (
            <FontAwesomeIcon
              icon={faHeart}
              className="text-red-500 transition-transform transform hover:scale-109 text-md sm:text-2xl cursor-pointer"
              onClick={handleLike}
            />
          ) : (
            <Heart
              className={`h:4 w-4 sm:h-6 sm:w-6 cursor-pointer transition-all transform hover:scale-109 text-gray-700 hover:text-red-500`}
              onClick={handleLike}
            />
          )}

          <MessageCircle
            className="h:4 w-4 sm:h-6 sm:w-6 -mt-1 sm:mt-0 text-gray-700 hover:text-blue-500 cursor-pointer transition-colors"
            onClick={() => {
              dispatch(postActions.setSelectedPost(post));
              setCommentOpen(true);
            }}
          />

          <IoIosShareAlt className=" h:5 w-5 sm:h-6 sm:w-6 text-gray-700 hover:text-green-500 cursor-pointer transition-colors" />
        </div>
        <Bookmark
          className={`h:4 w-4 sm:h-6 sm:w-6 cursor-pointer transition-colors ${
            bookmarked
              ? "text-yellow-500"
              : "text-gray-700 hover:text-yellow-500"
          }`}
          onClick={handleBookmark}
        />
      </div>
      <CommentBox open={commentOpen} setOpen={setCommentOpen} post={post} />
      <div className="px-4 pb-4 space-y-2 text-[10px] sm:text-sm">
        <div className="flex items-center gap-2  text-gray-700 dark:text-gray-300">
          <span className="font-semibold  hover:cursor-pointer">
            {likedPost} likes
          </span>
          <span className="font-medium ">{post?.author?.username}</span>
          <span className="text-gray-600 dark:text-gray-400">
            {post.caption}
          </span>
        </div>
        <span
          onClick={() => {
            dispatch(postActions.setSelectedPost(post));
            setCommentOpen(true);
          }}
          className="block text-[10px] sm:text-sm text-start text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
        >
          {post?.comments?.length
            ? `View all ${post.comments.length} comments...`
            : `No comments...`}
        </span>
        <div className="flex  items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={input}
            name="comment"
            onChange={inputHandler}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent outline-none text-[10px] sm:text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
          {input && (
            <button
              onClick={commentHandler}
              className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer rounded-md transition-colors"
            >
              Post
            </button>
          )}
        </div>
      </div>
      {openDel && (
        <DeleteConfirm
          open={openDel}
          setOpen={setOpenDel}
          post={selectedPost}
        />
      )}
    </div>
  );
};

export default Post;
