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

  if (!playlist || !playlist?.playlistData) {
    return <p>Playlist videos is not available</p>; 
  }

 const {name, description, createdAt} = playlist?.playlistData;

console.log("pl",playlist);

  return (
    <main className="bg-gray-50 min-h-screen">
  <section className='flex flex-col items-center mt-10 mb-5 p-4 bg-white shadow-md rounded-lg'>
    <h1 className='font-bold text-3xl text-gray-800'>{name}</h1>
    <p className='text-lg text-gray-600 mt-2'>{description}</p>
    <p className='text-gray-500 mt-1'>{new Date(createdAt).toLocaleDateString()}</p>
  </section>

  <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pt-6">
    {playlist?.videoData?.map((video) => (
      <Link to={`/playlist/${playlist?._id}/video/${video?._id}`} key={video?._id}>
        <VideoCard video={video} currentPlaylist={playlistId} />
      </Link>
    ))}
  </section>
</main>

  )
}

export default Playlist
