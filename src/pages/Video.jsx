import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../utils.js/axiosInstance';
import toast from 'react-hot-toast';
import Shimmer from '../components/Shimmer';

const Video = () => {

  const {videoId} = useParams();

  const {data: video, isLoading , isError} = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/video/vid/${videoId}`)    
      return response.data;
    },
    onError: (error) => {
      toast.error("error while fetching video")
    }
  });

  if (isLoading) return <Shimmer />
  if (isError) return <p>Error loading video</p>

  const formattedDate = new Date(video.createdAt).toLocaleDateString();


  return (
    <main className="video-page flex flex-col items-center justify-center py-8 bg-gray-900 px-4">
    {/* Video Player Section */}
    <section className="w-full xl:w-9/12 rounded-lg overflow-hidden">
      <video controls src={video.video} className="w-full h-auto aspect-video"></video>
    </section>

    {/* Collapsible Video Info Section */}
    <section className="bg-base-200 collapse w-full xl:w-9/12 mt-4">
      <input type="checkbox" className="peer" />
      <header className="collapse-title  text-primary-content peer-checked:bg-slate-600 peer-checked:text-secondary-content">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <p className="text-sm">{video.views} views • {formattedDate}</p>
          <div className="flex items-center gap-4 mt-3">
            <img
              src={video.ownerAvatar}
              alt="owner avatar"
              className="w-12 h-12 rounded-full"
            />
            <p className="font-semibold">{video.owner}</p>
          </div>
        </div>
      </header>
      <article className="collapse-content  text-white peer-checked:bg-slate-600 ">
        <p className="text-md mt-4">{video.description}</p>
      </article>
    </section>
  </main>
  )
}

export default Video
