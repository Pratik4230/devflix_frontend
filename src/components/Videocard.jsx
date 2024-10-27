
import React from 'react'


const VideoCard = ({video}) => {
  

  const {title, duration, views, createdAt , ownerDetails, thumbnail} = video
  const {channelName, avatarImage} = ownerDetails;


  
  
  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 bg-white">
  <section className="relative w-full h-48 md:h-40 lg:h-44 bg-black">
    <img src={thumbnail.url} alt={title} className="w-full h-full object-cover" />
    <p className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-lg shadow-md">
      {duration.toFixed(2)} mins
    </p>
  </section>

  <section className="p-4">
    <h3 className="text-md font-semibold line-clamp-2">{title}</h3>

    <div className="flex justify-between items-center mt-2">
      <section className="flex items-center gap-3">
        <img
          src={avatarImage.url}
          alt={channelName}
          className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium">{channelName}</p>
          <p className="text-xs text-gray-500">{views} views</p>
        </div>
      </section>

      <div className="flex items-center text-gray-500 text-xs">
        <p>{new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  </section>
</div>

  )
}

export default VideoCard;
