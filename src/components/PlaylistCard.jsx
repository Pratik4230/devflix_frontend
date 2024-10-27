import React from 'react'

const PlaylistCard = ({playlist}) => {

    const {name, owner, videos} = playlist;
    const {avatarImage, channelName} = owner; 

    
  return (
    <div className='flex flex-col items-center border-2 p-5 m-5 bg-violet-400 rounded-xl'>
      <section className='p-2 text-black my-2'>
        <p  className='font-bold text-2xl '>{name}</p>
        <p className='flex  justify-end'>{videos.length} videos</p>
      </section>

      <section className='flex my-2 items-center'>
        <img className='h-14 w-14 rounded-full' src={avatarImage.url} alt={channelName} />
        <p className='ml-2 p-2 font-semibold text-xl text-gray-950'>{channelName}</p>
      </section>
    </div>
  )
}

export default PlaylistCard
