import React from 'react'
import { axiosInstance } from '../utils.js/axiosInstance'
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Shimmer from '../components/Shimmer';
import VideoCard from '../components/Videocard';

const Feed = () => {

  const getFeed = async () => {
    const response = await axiosInstance.get('/video/feed');
    return response.data;
  }

  const query = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
    staleTime: 1000*60*10,
    onSuccess: () => {
      toast.success('feed loaded successfully!');
      console.log("feed",query.data);
      
    },
    onError: (error) => {
      toast.error(`Error fetching videos: ${error.message}`)
    }
  });

  if (query.isLoading) {
    return <Shimmer/>
  }

  if (query.isError) {
    return <div>Error</div>
  }

  if (!query.data || query.data.length === 0) {
    return <p>No videos found.</p>;
  }


  return (

    // <>feedds {console.log(query?.data?.videos[1])
    // } 
    // <VideoCard video={query?.data?.videos[1]}/>
    // </>
    <div className="flex flex-col gap-7 z-5 max-w-screen pt-7">
    {query.data?.videos.map((video) => (
      <VideoCard key={video.id} video={video} />
    ))}
  </div>
  )
}

export default Feed
