import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axiosInstance';
import Shimmer from '../components/Shimmer';
import { Link } from 'react-router-dom';
import Videocarrd from '../components/Videocarrd';
import { useEffect } from 'react';
import { LoaderPinwheel } from 'lucide-react';

const Feed = () => {
  const {
    data: feed,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
   queryKey:['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`/video/feed?page=${pageParam}&limit=15`);
      return response.data;
    },
      getNextPageParam: (lastPage) => {
        if (lastPage.videos.length === 0) return undefined; 
        return lastPage.currentPage + 1; 
      },
      staleTime: 1000 * 60 * 5,
    
});

 
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 5  >=
        document.documentElement.scrollHeight
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  
  if (isLoading) return <Shimmer />;

 
  if (isError) {
    return <div>Error loading feed.</div>;
  }

  console.log("feed", feed);
  
  if (!feed || feed.pages[0]?.videos.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 dark:bg-black">
      {feed.pages.map((page) => (
        page.videos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}>
            <Videocarrd video={video} />
          </Link>
        ))
      ))}
      <p className='flex justify-center items-center' > {isFetchingNextPage &&   < LoaderPinwheel className='animate-spin flex justify-center items-center text-blue-500' size={33} /> } </p>
      
    </div>
  );
};

export default Feed;
