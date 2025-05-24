import React from 'react';
import Post from './Post'; 
import { useSelector } from 'react-redux';

const Posts = () => {
  const {posts} = useSelector(state => state.post); // return value directly

 // protect against undefined/null

  return (
    <div className='text-center'>
      {posts.map((post) => (
  <Post key={post._id} post={post} className="h-80 w-80" />
))}

    </div>
  );
};

export default Posts;
