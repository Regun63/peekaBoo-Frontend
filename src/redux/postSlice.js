import {createSlice} from"@reduxjs/toolkit"

const postsSlice = createSlice({
    name: "post",
    initialState: { posts: [], selectedPost:null },
    reducers: {
        setUserPost: (state, action) => {
        state.posts= action.payload;
      },
        setSelectedPost: (state, action) => {
        state.selectedPost= action.payload;
      },
      
    }
  });
  

export const postActions=postsSlice.actions;
export default postsSlice.reducer;