import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {authActions} from '../../redux/authorSlice'
import { toast } from "react-toastify";
import axios from 'axios';

const EditProfile = () => {
  const { users } = useSelector((store) => store.author);
  const { avatarColor } = useSelector((store) => store.color);
   const[loading,setLoading]=useState(false)
   const[profilePic,setProfilePic]=useState()
   const[input,setInput]=useState({
    profilePhoto:users?.profilePicture,
    bio:users?.bio ||"",
    gender:users?.gender||"Male" ,
    username:users?.username
   })
 

  const imageRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    const preview=URL.createObjectURL(file)
    if (file) {
   setInput({...input,profilePhoto:file})
   setProfilePic(preview)
    }
  };
    const selectChangeHandler=(value)=>{
      setInput({...input,gender:value});
    }


  const handleSaveChanges = async() => {
    console.log(input)
    const formData= new FormData();
    formData.append("bio",input.bio);
    formData.append("gender",input.gender);
    formData.append("username",input.username);

    if (input.profilePhoto) {
      formData.append('profilePhoto', input.profilePhoto);
    }
   
    
  try{
    setLoading(true);
    const res=await axios.post('https://peekaboo-mybackend.onrender.com/api/peekaBoo/user/profile/edit',formData,{
      headers:{
        'Content-Type':'multipart/form-data'
      },
      withCredentials:true
    });
    
    if(res.data.success){
      const updatedUserData={
        ...users,
        bio:res.data.user?.bio,
        profilePicture:res.data.user?.profilePicture,
        gender:res.data.user?.gender,
        username:res.data.user?.username
      };
      
      dispatch(authActions.setAuthUser(updatedUserData));
      
       navigate(`/profile/${users?._id}`);
       toast.success(res.data.message);
    }
  }
  catch(error){
    console.log(error)
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    toast.error(message);
  }
 // or show a success message
 finally{
   setLoading(false);
 }
  };

  return (
    <div>
      <h1 className="md:text-2xl sm:text-xl mb-4 text-lg text-black font-semibold font-sans text-center">
        Edit Profile
      </h1>

      <div className="flex-col space-y-5 bg-sky-300/20 h-screen rounded-2xl">
        {/* Profile Info */}
        <div className="flex flex-col sm:py-4 md:ml-45 ml-20 text-center w-[70%]  rounded-2xl sm:flex-row sm:items-center sm:justify-evenly space-y-6 sm:space-y-0 sm:space-x-10">
          <div className="flex justify-center gap-4">
            <Avatar className="h-15 w-15 lg:h-24 lg:w-24 rounded-full border-4 border-purple-800 overflow-hidden">
              <AvatarImage
                src={profilePic || users?.profilePicture}
                alt="Profile_Image"
                className="object-cover w-full h-full"
              />
              <AvatarFallback
                className="flex items-center justify-center font-medium text-white w-full h-full rounded-full dark:text-gray-300 text-3xl sm:text-5xl"
                style={{ backgroundColor: avatarColor }}
              >
                {users?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-col mt-6">
              <h1 className="md:text-xl text-sm font-semibold max-w-[420px] wrap-break-word">{users?.username}</h1>
              <p className="md:text-lg text-xs text-gray-600 max-w-[420px] wrap-break-word">{users?.bio || "bio here...."}</p>
            </div>
          </div>
          <input
            type="file"
            ref={imageRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          <Button
            onClick={() => imageRef?.current.click()}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: { xs: "12px", md: "14px" },
              px: { md: 2.5 },
              py: 0.5,
              marginX: { md: 2, xs: 1 },
              color: "#f0f0f0",
              backgroundColor: "#0370ff",
              "&:hover": {
                backgroundColor: "#045fd6",
              },
            }}
          >
            Change Photo
          </Button>
        </div>

        {/* Username Input */}
        <h1 className="md:text-2xl sm:text-xl text-lg text-black font-semibold font-sans text-center">
          Username
        </h1>
        <div className="flex flex-row md:justify-center justify-start ml-20 items-center sm:space-x-4 my-10">
          <TextField
            label="Username"
            variant="outlined"
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            size="small"
            sx={{
              width:"50%"
            }}
          />
        </div>

        {/* Bio Input */}
        <h1 className="md:text-2xl sm:text-xl text-lg text-black font-semibold font-sans text-center">
          Bio
        </h1>
        <div className="w-full h-[150px] flex items-center justify-center">
          <textarea
            name="Bio"
            value={input.bio}
            onChange={(e) =>setInput({...input,bio:e.target.value})}
            placeholder="Write a short bio about yourself..."
            className="h-full w-[80%] rounded-xl border border-gray-300 p-4 resize-none text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          ></textarea>
        </div>

        {/* Gender Input */}
        <h1 className="md:text-2xl sm:text-xl text-lg text-black font-semibold font-sans text-center">
          Gender
        </h1>
        <div className="flex justify-center items-center my-4">
          <TextField
            select
            label="Select Gender"
            value={input.gender}
            defaultValue='Male'
            onChange={(e)=> selectChangeHandler(e.target.value)}
            size="small"
            sx={{ width: "40%" }}
          >
            <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>
        </div>

        {/* Save Changes */}
        <div className="flex justify-center my-4">
          <Button
            onClick={handleSaveChanges}
            disabled={loading} 
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: { xs: "12px", md: "14px" },
              px: { xs: 2, md: 3 },
              py: 0.5,
              color: "#f0f0f0",
              backgroundColor: "#0370ff",
              "&:hover": {
                backgroundColor: "#045fd6",
              },
            }}
          >
            {
              loading?"Updating...":"Save Change"
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
