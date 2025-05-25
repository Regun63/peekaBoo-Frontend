import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useUserProfile from "../../hooks/useUserProfile";
import Button from "@mui/material/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector, useDispatch } from "react-redux";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { postActions } from "../../redux/postSlice";
import CommentBox from "./CommentBox";
import DeleteConfirm from "./DeleteConfirm";
import { Box, Modal } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";


const Profile = () => {
  const params = useParams();
  const profileUserId = params.id; // The profile's user ID
  const dispatch = useDispatch();
  
  const { userProfile, users } = useSelector((store) => store.author);
  const { avatarColor } = useSelector((store) => store.color);

  const [isFollow, setIsFollow] = useState(users?.following?.includes(userProfile?._id));
  const [isActive, setIsActive] = useState("Posts");
  const [openDel, setOpenDel] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPostCom, setSelectedPostCom] = useState(null);
  const [selectedPostDel, setSelectedPostDel] = useState(null);

  // Fetch user profile on load or userId change
  useUserProfile(profileUserId);
 
  // Initialize isFollow when userProfile or users change
  useEffect(() => {
    if (users && userProfile) {
      setIsFollow(userProfile.followers?.includes(users._id));
    }
  }, [userProfile, users]);

  const displayUserPosts =
    isActive === "Posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleClose = () => setOpen(false);

  const handleDeleteClick = (post) => {
    setSelectedPostDel(post);
    setOpenDel(true);
  };

  const handleFollower = async () => {
    try {
      // Send request with the profile user's id (the one to follow/unfollow)
      const res = await axios.post(
        `https://peekaboo-mybackend.onrender.com/api/peekaBoo/user/follow_or_unfollow/${profileUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsFollow(res.data.following); // Update follow state based on server response
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update follow status.");
    }
  };
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-6 sm:space-y-0 sm:space-x-10">
        {/* Avatar */}
        <Avatar
          onClick={() => {
            setOpen(!open);
          }}
          className="h-24 w-24 lg:h-32 lg:w-32 rounded-full border-4 border-purple-800 overflow-hidden"
        >
          <AvatarImage
            src={userProfile?.profilePicture}
            alt="Profile_Image"
            className="object-cover w-full h-full"
          />
          <AvatarFallback
            className="flex items-center justify-center font-medium text-white w-full h-full rounded-full dark:text-gray-300 text-3xl sm:text-5xl"
            style={{ backgroundColor: avatarColor }}
          >
            {userProfile?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Profile Info */}
        <div className="flex flex-col space-y-4 w-full sm:w-auto">
          {/* Username & Buttons */}
          <div className="flex flex-col items-start space-y-2">
            <h1 className="md:text-2xl text-lg font-sans text-gray-700 dark:text-gray-200">
              {userProfile?.username || "Username"}
            </h1>

            {/* Responsive Button Group */}
            <div className="flex flex-wrap gap-2">
              {userProfile?._id === users?._id ? (
                <Link to={"/profile/edit"}>
                  <Button
                    disableElevation
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: { xs: "12px", md: "14px" },
                      px: { xs: 1.5, md: 2.5 },
                      py: 0.5,
                      marginX: { md: 2, xs: 1 },
                      borderColor: "#dbdbdb",
                      color: "#262626",
                      backgroundColor: "#ccdbfd",
                      "&:hover": {
                        backgroundColor: "#b6ccfe",
                        borderColor: "#c7c7c7",
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    onClick={handleFollower} 
                    disableElevation
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: { xs: "12px", md: "14px" },
                      px: { xs: 1.5, md: 2.5 },
                      py: 0.5,
                      marginX: { md: 2, xs: 1 },
                      borderColor: "#dbdbdb",
                      color: "#f0f0f0",
                      backgroundColor: "#0000ff",
                      "&:hover": {
                        backgroundColor: "#0000a1",
                        borderColor: "#f0f0f0",
                      },
                    }}
                  >
                    {isFollow ? "Unfollow" : "Follow"}
                  </Button>
                  <Button
                   
                    disableElevation
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: { xs: "12px", md: "14px" },
                      px: { xs: 1.5, md: 2.5 },
                      py: 0.5,
                      marginX: { md: 2, xs: 1 },
                      borderColor: "#dbdbdb",
                      color: "#f0f0f0",
                      backgroundColor: "#0000ff",
                      "&:hover": {
                        backgroundColor: "#0000a1",
                        borderColor: "#f0f0f0",
                      },
                    }}
                  >
                    <Link to={"/message"}>
                    Message</Link>
                    
                  </Button>
                </>
              )}

              <Button
                disableElevation
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: { xs: "12px", md: "14px" },
                  px: { xs: 1.5, md: 2.5 },
                  py: 0.5,
                  marginX: { md: 2, xs: 1 },
                  borderColor: "#dbdbdb",
                  color: "#262626",
                  backgroundColor: "#ccdbfd",
                  "&:hover": {
                    backgroundColor: "#b6ccfe",
                    borderColor: "#c7c7c7",
                  },
                }}
              >
                About
              </Button>
              <Button
                disableElevation
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: { xs: "12px", md: "14px" },
                  px: { xs: 1.5, md: 2.5 },
                  py: 0.5,
                  marginX: { md: 2, xs: 1 },
                  borderColor: "#dbdbdb",
                  color: "#262626",
                  backgroundColor: "#ccdbfd",
                  "&:hover": {
                    backgroundColor: "#b6ccfe",
                    borderColor: "#c7c7c7",
                  },
                }}
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around text-sm sm:text-base text-gray-900 font-semibold">
            <p>
              {userProfile?.posts?.length || 0}
              <span className="text-gray-600 ml-1">posts</span>
            </p>
            <p>
              {userProfile?.followers?.length || 0}
              <span  className="text-gray-600 ml-1">followers</span>
            </p>
            <p>
              {userProfile?.following?.length || 0}
              <span className="text-gray-600 ml-1">following</span>
            </p>
          </div>

          {/* Bio */}
          <div className="flex justify-start space-x-3">
            <span className="bg-purple-100 text-purple-800 text-xs font-medium py-1  px-2.5  rounded-full dark:bg-purple-900 dark:text-purple-300">
              @{userProfile?.username}
            </span>
            <p className="text-sm text-gray-600 from-neutral-500 dark:text-gray-300 max-w-md break-words">
              {userProfile?.bio
                ? userProfile.bio.length > 150
                  ? userProfile.bio.slice(0, 150) + "..."
                  : userProfile.bio
                : "Add your bio here..."}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-screen mt-10  border-t-1 border-gray-400">
        <div className="flex justify-center font-medium  space-x-32">
          <span
            onClick={() => {
              setIsActive("Posts");
            }}
            className={`hover:text-blue-600 hover:cursor-pointer ${
              isActive === "Posts" ? "text-blue-600" : ""
            }`}
          >
            Posts
          </span>
          <span
            onClick={() => {
              setIsActive("Save");
            }}
            className={`hover:text-blue-600 hover:cursor-pointer  ${
              isActive === "Save" ? "text-blue-600" : ""
            }`}
          >
            Save
          </span>
          <span
            onClick={() => {
              setIsActive("Tags");
            }}
            className={`hover:text-blue-600 hover:cursor-pointer  ${
              isActive === "Tags" ? "text-blue-600" : ""
            }`}
          >
            Tags
          </span>
        </div>
        <div className="grid gap-1 md:grid-cols-3 grid-cols-2 ">
          {displayUserPosts &&
            displayUserPosts.map((post, index) => (
              <div
                key={post?._id || index}
                className="group cursor-pointer relative"
              >
                {post?.image ? (
                  <div>
                    <img
                      src={post.image}
                      alt="User_Post"
                      className="w-full h-full rounded-sm my-2 object-cover aspect-square"
                    />
                    <div className="absolute top-0 left-0 w-full h-[95%] rounded-sm bg-black/0 hover:bg-black/30 my-2 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-4 text-white transition duration-300">
                      <div className="flex items-center gap-1">
                        {post?.likes.length}
                        <Heart className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1">
                        {post?.comments.length}
                        <MessageCircle
                          className="w-6 h-6"
                          onClick={() => {
                            dispatch(postActions.setSelectedPost(post));
                            setSelectedPostCom(post);
                          }}
                        />
                      </div>
                      {userProfile?._id === users?._id && (
                        <div>
                          <Trash2
                            onClick={() => handleDeleteClick(post)}
                            className="w-6 h-6 "
                          />
                        </div>
                      )}
                    </div>

                    {/* CommentBox for this post */}
                    {selectedPostCom && (
                      <CommentBox
                        open={true}
                        setOpen={() => setSelectedPostCom(null)}
                        post={selectedPostCom}
                      />
                    )}
                    {openDel && (
                      <DeleteConfirm
                        open={openDel}
                        setOpen={setOpenDel}
                        post={selectedPostDel}
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 my-2 aspect-square rounded-sm flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
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
            width: { xs: "95%", sm: 500 },
            maxWidth: "70vw",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            height: "60vh",
          }}
        >
          <img
            src={userProfile?.profilePicture}
            alt="Post"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Profile;
