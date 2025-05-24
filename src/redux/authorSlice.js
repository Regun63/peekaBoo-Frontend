import {createSlice} from"@reduxjs/toolkit"

const authSlice=createSlice({
    name:"auth",
    initialState:{users:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
        
        
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.users=action.payload;
          
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload;
            
        },
        setUserProfile:(state,action)=>{
            state.userProfile=action.payload;
            
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
            
        },
       

    }
})

export const authActions=authSlice.actions;
export default authSlice.reducer;