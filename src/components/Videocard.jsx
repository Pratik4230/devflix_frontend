import React from 'react'

const VideoCard = ({video}) => {
  console.log("hii", video);

  const {title, duration, views , ownerDetails, description, thumbnail} = video

  const {channelName, avatarImage} = ownerDetails

  
  
  return (
    <div className='flex  flex-col lg:flex-row items-center lg:justify-end max-w-screen  p-1.5 rounded-xl '>

      <section className=' w-full lg:w-3/12 h-56 rounded-md relative mx-3 bg-slate-950 shadow-2xl' >
         <img src={thumbnail.url} alt="thumbnail" className='w-full h-full rounded-md  ' />
         <p className='absolute bottom-2 bg-black text-white p-1.5 rounded-lg right-2'>{duration.toFixed(2)}</p>
       </section>
 
      <section className=' w-full h-32 lg:h-56 lg:w-6/12  px-1 pt-1.5 pl-3 flex flex-col gap-2 max-w-screen bg-slate-950 shadow-2xl'>
        <p className='font-bold text-xl lg:text-2xl' >{title}</p>
        <p>{views} views</p>
        <div className='flex items-center gap-5'>
          <img src={avatarImage.url} alt="avatar" className='w-10 h-10 lg:w-12 lg:h-12 rounded-full' />
          <p className='font-semibold text-xl'>{channelName}</p>
        </div>
      <p className=' hidden lg:block text-lg'>{description}</p>
      </section>


    </div>
  )
}

export default VideoCard
