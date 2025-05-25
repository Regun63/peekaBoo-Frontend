import {useEffect} from "react"
import axios from "axios"
import {useDispatch} from "react-redux"
import {postActions} from "../redux/postSlice"
 const getAllPosts=()=>{
    const dispatch=useDispatch();
 useEffect(()=>{
    const fetchPosts=async()=>{
        try {
            const res=await axios.get("https://peekaboo-backend-2-49bc.onrender.com/api/peekaBoo/post/all",{withCredentials:true})
        if(res.data.success)
        dispatch(postActions.setUserPost(res.data.posts))
        } catch (error) {
           console.log(error) 
        }
    }
    fetchPosts()
 },[])
}
export default getAllPosts