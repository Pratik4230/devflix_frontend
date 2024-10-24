import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import Shimmer from '../components/Shimmer';
import CommentSection from '../components/CommentSection';
import { LoaderPinwheel } from 'lucide-react';


const Video = () => {
  const { videoId } = useParams();
  const queryClient = useQueryClient()

  const { data: video, isLoading, isError } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/video/vid/${videoId}`);
      return response.data;
    },
    onError: () => {
      toast.error('error while fetching video');
    },
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: async (channel) => {
      const response = await axiosInstance.post(`/subscription/subscribe/${channel}`);
      return response.data;
    },
    onSuccess: (data) => {
     
      queryClient.invalidateQueries(['video', videoId]);
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Error while subscribing/unsubscribing');
    },
  });

  const toggleSubscribe = (id) =>{
    console.log(id)
    
    toggleSubscriptionMutation.mutate(id)
  }

  if (isLoading) return <Shimmer />;
  if (isError) return <p>Error loading video</p>;

  const formattedDate = new Date(video.createdAt).toLocaleDateString();

  return (
    <main className="video-page flex flex-col items-center justify-center py-8 bg-gray-900 px-4">
     
      <section className="w-full xl:w-9/12 rounded-lg overflow-hidden">
        <video controls src={video.video} className="w-full h-auto aspect-video"></video>
      </section>

      
      <section className="bg-base-200 w-full xl:w-9/12 mt-4 p-4  rounded-lg">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <p className="text-sm">
            {video.views} views • {formattedDate}
          </p>
         
          <Link
            to={`/channel/${video?.channelId}`}
            className="flex items-center  gap-3 text-2xl bg-black rounded-lg w-fit p-2 mt-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={video.ownerAvatar}
              alt="owner avatar"
              className="w-12 h-12 rounded-full"
            />
            <p className="font-semibold">{video.owner}</p>
          </Link>

          <button
            onClick={() => toggleSubscribe(video.channelId)}
            className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold ${
              video.isSubscribed ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
      { toggleSubscriptionMutation?.isPending ? <LoaderPinwheel className='animate-spin text-white' /> :  video.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>

        </div>

        
        <section className="collapse bg-slate-900 mt-4">
          <input type="checkbox" className="peer" />
          <header className="collapse-title text-primary-content peer-checked:bg-slate-950 peer-checked:text-secondary-content">
            <p className="  text-white font-semibold text-lg">Show Description</p>
          </header>
          <article className="collapse-content text-white peer-checked:bg-slate-950">
            <p className="text-md mt-4">{video.description}</p>
          </article>
        </section>
      </section>

      <CommentSection videoId={videoId} />
    </main>
  );
};

export default Video;
