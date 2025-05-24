import React from 'react'
import SuggestUserbar from './SuggestUserbar'
import Posts from './Posts'
const Feed = () => {
  
  return (
    <div className='flex w-[95%] ml-15'>
        <div className='w-3/4'>
        
          <Posts/>

        </div>
      <div className='w-1/4'>
      <SuggestUserbar/>
      </div>
    </div>
  )
}

export default Feed
