import * as React from "react";
import axios from "axios";
import { Box, Button, Typography, Modal, Stack } from "@mui/material";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { colorActions } from "../../redux/colorSlice";
import { postActions } from "../../redux/postSlice"; 
import Comment from "./Comment";
import { toast } from "react-toastify"; 
const CommentBox = ({ open, setOpen, post }) => {
  const handleClose = () => setOpen(false);
  const [input, setInput] = useState("");
  const [isFollow, setIsFollow] = useState("");

  const { users } = useSelector((store) => store.author);
  const { avatarColor } = useSelector((store) => store.color);
  const { selectedPost } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const inputHandler = (e) => {
    setInput(e.target.value);
  };

  const commentHandler = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/peekaBoo/post/${selectedPost?._id}/comment`,
        { input },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );

      const newComment = res.data.comment;
      if (res.data.success) {
        const updatedComments = [...selectedPost.comments, newComment];
        const updatedPost = {
          ...selectedPost,
          comments: updatedComments
        };

        dispatch(postActions.setSelectedPost(updatedPost));
        toast.success(res.data.message);
        setInput("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    dispatch(colorActions.generateNewColor());
  }, []);

  return (
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
          width: { xs: "95%", sm: 800 },
          maxWidth: "70vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          height: "60vh"
        }}
      >
        {/* Left: Image */}
        <Box sx={{ flex: 1, backgroundColor: "#e2fdff" }}>
          <img
            src={post?.image}
            alt="Post"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </Box>

        {/* Right: Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: 2,
            py: 2,
            gap: 2
          }}
        >
          {/* User info */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Link to={`/peekaBoo/profile/${post?.author?._id}`}>
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage
                  src={users?.image}
                  alt="Profile_Image"
                  className="rounded-full object-cover h-10 w-10 border-2 border-blue-500"
                />
                <AvatarFallback
                  className="rounded-full flex items-center justify-center h-10 w-10 text-white text-sm"
                  style={{
                    backgroundColor: avatarColor
                  }}
                >
                  {post?.author?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>

            <Typography variant="subtitle1" fontWeight={500}>
              <Link to={`/peekaBoo/profile/${post?.author?._id}`} className="text-gray-800 hover:text-gray-600">
                {post?.author?.username || "username"}
              </Link>
            </Typography>

           {
            selectedPost?.author?._id !== users?._id &&
            <Button
            onClick={()=>{setIsFollow(!isFollow)}}
              sx={{
                ml: "auto",
                backgroundColor: "#bcf0da",
                "&:hover": { backgroundColor: "#84E1BC" },
                color: "#1C64F2",
                borderRadius: "9999px",
                textTransform: "none",
                fontWeight: 500,
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                px: 2,
                py: 0.5
              }}
            >
              {
                isFollow?"Unfollow":"Follow"
              }
            </Button>
           }
          </Stack>

          {/* Comments List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              borderTop: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
              pt: 2
            }}
          >
            {selectedPost?.comments?.length > 0 ? (
              selectedPost.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>

          {/* Comment Input */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <input
              type="text"
              value={input}
              onChange={inputHandler}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commentHandler();  // call the function
                }
              }}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500  px-3 py-1 rounded-md"
            />
            {input.trim() && (
              <Button
                onClick={commentHandler}
                variant="contained"
                sx={{
                  backgroundColor: "#1C64F2",
                  "&:hover": { backgroundColor: "#1a56db" },
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.5
                }}
              >
                Post
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default CommentBox;
