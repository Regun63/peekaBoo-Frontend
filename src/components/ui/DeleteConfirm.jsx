import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { postActions } from "../../redux/postSlice";
import { toast } from "react-toastify";
import axios from "axios";
const DeleteConfirm = ({open,setOpen,post}) => {
    const {posts} = useSelector(store=>store.post);
    const handleClose = () => setOpen(false);
    const dispatch=useDispatch();
    const deletePostHandler = async () => {
      
        try {
          const res = await axios.delete(`https://peekaboo-backend-1.onrender.com/api/peekaBoo/post/delete/${post?._id}`, {
            withCredentials: true,
          });
   
          if (res.data.success) {
            handleClose() 
            const updatedPost = posts.filter(postItem => postItem?._id !== post?._id);
            dispatch(postActions.setUserPost(updatedPost));
            toast.success(res.data.message);
          } else {
           
            toast.error("Post has already been deleted");
          }
        } catch (error) {
          console.log(error)
          toast.error(error?.response?.data?.message );
        }
      };
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
        <Typography variant="h6" fontWeight={600}>
            <h1>Are you sure you want to delete </h1>
        </Typography>
        <Box
        sx={{
            display: "flex",
            justifyContent:"space-between",
            width: "100%",
            gap:6,
            
        }}>

        <Button
        onClick={deletePostHandler}
          sx={{
            backgroundColor: "#00D100",
            "&:hover": { backgroundColor: "#00A300" },
            color: "white",
            borderRadius: "9999px",
            textTransform: "none",
            fontWeight: 700,
            width: "50%",
            paddingX: 4,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          Yes
        </Button>

        <Button
            onClick={handleClose}
          sx={{
            backgroundColor: "#FF0000",
            "&:hover": { backgroundColor: "#D10000" },
            color: "white",
            borderRadius: "9999px",
            textTransform: "none",
            fontWeight: 700,
            width: "50%",
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          No
        </Button>
        </Box>
       

      </Box>
    </Modal>
  );
};

export default DeleteConfirm;
