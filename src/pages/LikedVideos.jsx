import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../utils/axiosInstance'
import toast from 'react-hot-toast'
import Shimmer from '../components/Shimmer'
import Videocarrd from '../components/Videocarrd'
import { Link } from 'react-router-dom'

const LikedVideos = () => {

    const {data: LikedVideo, isLoading, isError} = useQuery({
        queryKey: ["LikedVideos"],
        queryFn: async () => {
            const response = await axiosInstance.get('/like/videos');
            return response?.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "liked videos");
        },
        // refetchInterval: 10000, 
        onError: (error) => {
            toast.error(error.response.data?.message|| "failed to fetch liked videos")
        }
    });

    if (isLoading) return <Shimmer/>
    

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-semibold text-gray-800">Liked Videos</h1>
      <p className="text-gray-600">
        You have liked {LikedVideo?.data?.length || 0} videos
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {LikedVideo?.data?.length ? (
        LikedVideo?.data?.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}>
            <Videocarrd video={video} className="transition duration-200 transform hover:scale-105 shadow hover:shadow-lg rounded-lg overflow-hidden" />
          </Link>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">No liked videos yet. Explore and like some!</p>
      )}
    </div>
  </main>
  )
}

export default LikedVideos
