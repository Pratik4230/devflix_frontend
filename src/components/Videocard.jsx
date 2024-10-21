import React from 'react'

const VideoCard = ({video}) => {
  // console.log("hii", video);

  const {title, duration, views , ownerDetails, description, thumbnail} = video

  const {channelName, avatarImage} = ownerDetails

  
  
  return (
    <div className='flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 bg-white '>

      <section className='relative w-full h-48 md:h-40 lg:h-44 bg-black' >
         <img src={thumbnail.url} alt={title} className='w-full h-full object-cover' />
         <p className='absolute bottom-2 right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded'>{duration.toFixed(2)}</p>
       </section>
 
      <section className='p-3'>
        <h3 className='text-md font-semibold line-clamp-2' >{title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <img
            src={avatarImage.url}
            alt={channelName}
            className="w-9 h-9 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium">{channelName}</p>
            <p className="text-xs text-gray-500">{views} views</p>
          </div>
        </div>
        
      </section>


    </div>
  )
}

export default VideoCard
