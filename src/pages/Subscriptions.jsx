import { useQuery } from '@tanstack/react-query'

import { axiosInstance } from '../utils/axiosInstance'
import { Link } from 'react-router-dom'

import Shimmer from '../components/Shimmer';

import Videocard from '../components/VideoCard';

const Subscriptions = () => {

  const {data: subscribedTo } = useQuery({
     queryKey: ['subscribedTo'],
     queryFn: async () => {
       const response = await axiosInstance.get(`/subscription/channels`);
       return response?.data;
     },
     staleTime: 1000*60*10,
  });

  const {data: subsVideos, isLoading: subsVideosLoading} = useQuery({
    queryKey: ["subsVids"],
    queryFn: async () => {
      const response = await axiosInstance.get("/subscription/subsVids");
      return response?.data;
    }
  })

  if (subsVideosLoading) {
    return <Shimmer/>
  }

  return (
    <div>
    
      <section className='flex overflow-x-auto py-5 space-x-4 scrollbar-hide'>
  {subscribedTo?.map((sub) => (
    <Link key={sub?._id} to={`/channel/${sub?._id}`}>
      <div className='flex-shrink-0 flex flex-col items-center p-2 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200'>
        <img src={sub?.avatarImage} alt="Channel Avatar" className='h-14 w-14 rounded-full object-cover mb-2' />
        <p className='text-sm font-medium text-white'>{sub?.channelName}</p>
      </div>
    </Link>
  ))}
</section>


      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 ">
        {subsVideos?.videos?.map((video) => (
 <Link to={`/video/${video._id}`} key={video._id}  > <Videocard  video={video} /> </Link>
        ))}
      </section>

     

    </div>
  )
}

export default Subscriptions
