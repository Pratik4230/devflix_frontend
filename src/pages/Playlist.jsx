import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '../utils/axiosInstance'
import VideoCard from '../components/VideoCard'

const Playlist = () => {

  const {playlistId} = useParams()

  const{data: playlist, isLoading: playlistLoading} = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/playlist/playlist/${playlistId}`);
      return response?.data?.data[0];
    },
    staleTime: 1000*60*10,
    onSuccess: () => {
      toast.success(playlist?.message || "playlist fetched successfully");
      
    },
    onError: (error) => {
      toast.error( error?.response?.data?.message || "something went wrong")
    }
    
  })
  
  if (playlistLoading)  return <p>playlist Loading</p>

 const {name, description, createdAt} = playlist?.playlistData;


  return (
    <main>
     
      <section className='flex flex-col items-center mt-10 mb-5 '>
         
            <p className=' p-2 font-semibold text-2xl' >{name}</p>
            <p className='text-lg' >{description}</p>
            <p>{createdAt}</p>
      </section>
      

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 ">
    {playlist?.videoData?.map((video) => (
     <Link to={`/video/${video?._id}`} key={video?._id}  > <VideoCard video={video} /> </Link>
    ))}
  </section>
    </main>
  )
}

export default Playlist
