import {useEffect} from "react"
import axios from "axios"
import {useDispatch} from "react-redux"
import {authActions} from "../redux/authorSlice"
 const useSuggestedUsers=()=>{
    const dispatch=useDispatch();
 useEffect(()=>{
    const fetchPosts=async()=>{
        try {
            const res=await axios.get("https://peekaboo-backend-sush.onrender.com/api/peekaBoo/user/suggestedusers",{withCredentials:true})
        if(res.data.success)
        dispatch(authActions.setSuggestedUsers(res.data.users))
        } catch (error) {
           console.log(error) 
        }
    }
    fetchPosts()
 },[])
}
export default useSuggestedUsers