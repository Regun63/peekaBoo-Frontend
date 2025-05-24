import {createSlice} from"@reduxjs/toolkit"

const notifySlice=createSlice({
    name:"RTN",
    initialState:{likeNotification:[],
        messageNotification: [],
        unread: {}
    },
    reducers:{
        setlikeNotification:(state,action)=>{
            if(action.payload.type==='like'){
                state.likeNotification.push(action.payload)
            }else if(action.payload.type==='dislike'){
                state.likeNotification=state.likeNotification.filter((item)=>item.userId!==action.payload.userId)
            }
            else if(action.payload.type==='comment'){
              state.likeNotification.push(action.payload)
            }
          
        },
        addMessageNotification: (state, action) => {
            const alreadyExists = state.messageNotification.some(
                (msg) => msg._id === action.payload._id
              );
              if (!alreadyExists) {
                state.messageNotification.push(action.payload);
              }
          },
          clearMessageNotification: (state) => {
            state.messageNotification = [];
          },
          clearNotification: (state) => {
            state.likeNotification = [];
          },
          setUnread: (state, action) => {
            const userId = action.payload.senderID || action.payload._id;
            if (userId) {
              // Ensure unread exists
              if (!state.unread) {
                state.unread = {};
              }
          
              if (state.unread[userId]) {
                state.unread[userId]++;
              } else {
                state.unread[userId] = 1;
              }
            }
          }
          ,
      
          clearUnread: (state, action) => {
            delete state.unread[action.payload]; 
          },
    }
})

export const rtnActions=notifySlice.actions;
export default notifySlice.reducer;