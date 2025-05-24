import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../redux/chatSlice";

const usesocketRTM = () => {
  const dispatch = useDispatch();
  const { socketChat } = useSelector((store) => store.socketchat);
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!socketChat) return;

    const handleNewMessage = (newMessage) => {
      dispatch((dispatch, getState) => {
        const currentMessages = getState().chat.messages;
        dispatch(chatActions.setMessages([...currentMessages, newMessage]));

        const { selectedUser } = getState().auth;
        if (newMessage.senderID !== selectedUser?._id) {
          dispatch(chatActions.setUnread(newMessage.senderID));
        }
      });
    };

    socketChat.on("newMessage", handleNewMessage);

    return () => {
      socketChat.off("newMessage", handleNewMessage);
    };
  }, [dispatch, socketChat]);
};

export default usesocketRTM;
