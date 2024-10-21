import React from 'react'
import { axiosInstance } from '../utils/axiosInstance'
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Shimmer from '../components/Shimmer';
import VideoCard from '../components/Videocard';
import { Link } from 'react-router-dom';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 ">
    {query.data?.videos.map((video) => (
     <Link to={`/video/${video._id}`} key={video._id}  > <VideoCard video={video} /> </Link>
    ))}
  </div>
  )
}

export default Feed
