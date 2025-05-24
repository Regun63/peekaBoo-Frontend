import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/authorSlice";

const useUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return; // ✅ Defensive check

    const fetchUserProfile = async () => {
      try {
         const res1 = await axios.get(
            `https://peekaboo-backend-1.onrender.com/api/peekaBoo/user/profile/${userId}`,
            { withCredentials: true }
          );
          const res2 = await axios.get(
            `https://peekaboo-backend-1.onrender.com/api/peekaBoo/post/userpost/${userId}`,
            { withCredentials: true }
          );
          
          if (res1.data.success && res1.data.user) {
            const fullProfile = {
              ...res1.data.user,
              posts: res2.data.posts, // <-- Add posts here
            };
            dispatch(authActions.setUserProfile(fullProfile));
          }
          
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]); // ✅ include `dispatch` in deps
};

export default useUserProfile;
