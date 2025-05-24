import { useEffect } from "react";
import axios from "axios";
import { useDispatch} from "react-redux";
import { chatActions } from "../redux/chatSlice";

const useGetAllMessages = (selectedUser) => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedUser?._id) return;

    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `https://peekaboo-backend-1.onrender.com/api/peekaBoo/message/${selectedUser._id}/all`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(chatActions.setMessages(res.data.messages));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchAllMessages();
  }, [selectedUser, dispatch]);
};

export default useGetAllMessages;
