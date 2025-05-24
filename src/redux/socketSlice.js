import {createSlice} from"@reduxjs/toolkit"

const socketSlice=createSlice({
    name:"socketChat",
    initialState:{socketChat:null,
      
    },
    reducers:{
        setSocketChat:(state,action)=>{
            state.socketChat=action.payload;
          
        },
        
    }
})

export const socketActions=socketSlice.actions;
export default socketSlice.reducer;