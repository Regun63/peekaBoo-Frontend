import React from 'react' 
import { useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import {toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Feed from './Feed.jsx'
import getAllPosts from '../../hooks/getAllPosts'
import useSuggestedUsers from '../../hooks/useSuggestedUsers.jsx'



const Home = () => {
    const location = useLocation();
    const navigate=useNavigate();
    getAllPosts()
    useSuggestedUsers()
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {
        position: "top-right",
       
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  return (
   <div className=''>
    <Feed/>
   </div> 
  )
}

export default Home