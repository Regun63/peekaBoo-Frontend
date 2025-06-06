import React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  TextField
} from "@mui/material";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {toast } from "react-toastify";
import axios from 'axios';
import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import { postActions } from '../../redux/postSlice'; // path as per your structure



const Createpost = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);
  const colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#c084fc", "#0E9F6E", "#F17EB8", "#6B7280"];
  const [bgColor, setBgColor] = useState("");
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const {posts}=useSelector(store=>store.post)
  const [media, setMedia] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const {users}=useSelector(store=>store.author)
  const dispatch = useDispatch();
  useEffect(() => {
    setBgColor(getRandomColor());
  }, []);

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
      setMedia(file);
      if (file) {
        setPreviewURL(URL.createObjectURL(file));
  }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("clicked")
    const formData= new FormData();

    if(media) formData.append("image",media)
    if(media) formData.append("caption",caption)
    try {
      const res = await axios.post("https://peekaboo-backend-2-49bc.onrender.com/api/peekaBoo/post/addpost",formData,{
        headers:{
          "Content-Type":'multipart/form-data',
        },
        withCredentials:true,
      });
      if (res?.data?.message ) {
        toast.success(res.data.message);
        dispatch(postActions.setUserPost([res.data.post,...posts]));
      
      } else {
        toast.error("Post creation failed or returned invalid data.");
      }
      
      
    } catch (error) {
      console.log("Upload error",error)
    }finally{
      setOpen(false);
      setCaption("");
      setMedia(null);
      setLoading(false)
      setPreviewURL(null)
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          outline: 'none',
          border: 0,
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: "100%" }}>
          <Link to="/profile">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage
                src={users?.profilePicture}
                alt="Profile_Image"
                className="rounded-full object-cover h-10 w-10 border-2 border-blue-500"
              />
              <AvatarFallback
                className="rounded-full flex items-center justify-center h-10 w-10 bg-gray-300 text-white text-sm border-3 border-blue-500"
                style={{ backgroundColor: bgColor, borderRadius: 50, paddingBottom: 3.4 }}
              >
                {users?.username?.[0]?.toUpperCase() || "User"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Typography variant="subtitle1" fontWeight="light">
            <Link to="/profile" className="text-gray-800 hover:text-gray-600">
             {users?.username || "username"}
            </Link>
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="Caption"
            variant="outlined"
            multiline
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }} style={{backgroundColor:"#004CFF",color:"white"}}>
            Upload 
            <input type="file" accept="image/*,video/*" hidden onChange={handleFileChange} />
          </Button>

          {previewURL && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              {media.type.startsWith("image/") ? (
                <img
                  src={previewURL}
                  alt="preview"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              ) : (
                <video
                  src={previewURL}
                  controls
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              )}
               
            </Box>
          )}
          { previewURL &&
            
            <Button
              onClick={() => {
                setMedia(null);
                setPreviewURL(null);
              }}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#ff0d0d',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#e60000',
                },
                width:"100%",
                marginBottom:2
              }}
            >
              Remove 
            </Button>
           
          }

          <Button
            type="submit"
            variant="contained"
            onClick={()=>setLoading(true)}
            fullWidth
            disabled={!caption || !media}
            sx={{
              backgroundColor:"#004CFF",
              color:'white'
            }}
          >
            {
              loading? (
                <div className="flex items-center justify-center">
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                  </svg>
                  Uploading...
                </div>
              ) :"Post"
            }
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Createpost;
