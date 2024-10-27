
import { axiosInstance } from '../utils/axiosInstance'
import { useQuery } from '@tanstack/react-query';

import Shimmer from '../components/Shimmer';
import VideoCard from '../components/VideoCard';
import { Link } from 'react-router-dom';


const Feed = () => {


  const {data:feed , isLoading: feedLoading, isError: feedError} = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const response = await axiosInstance.get('/video/feed');
      return response.data
    },
    staleTime: 1000*60*10,
    
  });

  if (feedLoading) {
    return <Shimmer/>
  }

  if (feedError) {
    return <div>Error</div>
  }

  if (!feed || feed?.length === 0) {
    return <p>No videos found.</p>;
  }


  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 ">
    {feed?.videos?.map((video) => (
     <Link to={`/video/${video._id}`} key={video._id}  > <VideoCard  video={video} /> </Link>
    ))}
   
  </div>
  )
}

export default Feed
