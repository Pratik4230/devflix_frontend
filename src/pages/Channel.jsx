import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { LoaderPinwheel} from 'lucide-react'
import Shimmer from '../components/Shimmer';
import VideoCard from '../components/VideoCard';
import Postcard from '../components/Postcard';
import PlaylistCard from '../components/PlaylistCard';


const Channel = () => {

  const {channelId} = useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('videos');

  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistData, setPlaylistData] = useState({ name: '', description: '' });

  const {data: channel, isLoading, isError} = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/channel/${channelId}`);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error fetching channel")
    }
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (channel) => {
      const response = await axiosInstance.post(`/subscription/subscribe/${channel}`);
      return response.data;
    },
    onSuccess: (data) => {
       queryClient.invalidateQueries(['channel' , channelId]);
       toast.success(data?.message || "success")
    },
    onError: (error)=> {
      toast.error(error?.response?.data?.message)
    }
  })

 const toggleSubscribe = (id) => {
  subscriptionMutation.mutate(id)
  
 }

 const {data: channelVideos, isLoading: videosLoading} = useQuery({
  queryKey: ['channelVideos', channelId],
  queryFn: async () => {
     const response = await axiosInstance.get(`/video/vids/${channelId}`);
     console.log("grg",response?.data);
     
     return response?.data;
  },
  enabled: tab === 'videos', 
 });

 const {data: posts, isLoading: postsLoading} = useQuery({
  queryKey:['channelPosts', channelId],
  queryFn: async () => {
    const response = await axiosInstance.get(`/post/channel/${channelId}`);
    return response?.data;
  },
  enabled: tab == 'posts',
 });

 const {data: playlists, isLoading: playlistsLoading} = useQuery({
   queryKey: ['channelPlaylist', channelId],
   queryFn: async () => {
    const response = await axiosInstance.get(`/playlist/playlists/${channelId}`)
    return response?.data;
   },
   enabled: tab == 'playlists'
 });

 const createPlaylistMutation = useMutation({
  mutationFn: async (playlistData) => {
    const response = await axiosInstance.post('/playlist/create', playlistData);
    return response.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['channelPlaylist', channelId]);
    toast.success('Playlist created successfully');
    setShowCreatePlaylist(false);
  },
  onError: (error) => {
    toast.error(error?.response?.data?.message || 'Error creating playlist');
  },
});
 
 const handleCreatePlaylist = (e) => {
  e.preventDefault();
  if (!playlistData.name) {
    return toast.error('Playlist name is required');
  }
  createPlaylistMutation.mutate({ ...playlistData, owner: channel?._id });
};


  if (isLoading) return <div>Loading channel ...</div>
  if (isError) return <div>Loading channel error ...</div>

  return (
    <>
    <main className="p-5">
    <div className="flex flex-col items-center">
      {channel.coverImage?.url && (
        <img src={channel.coverImage.url} alt="cover" className="w-full h-60 object-cover rounded-lg mb-4" />
      )}
      <img src={channel.avatarImage?.url} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
      <h2 className="text-2xl font-bold mt-4">{channel.channelName}</h2>
      <p className="text-gray-400">{channel.userName}</p>
      <p className="mt-2">Subscribers: {channel.subscribersCount}</p>
      <p className="mt-2">Subscribed To: {channel.SubscribedToCount}</p>
      <button onClick={() => toggleSubscribe(channel._id)} className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold ${
              channel.isSubscribed ? 'bg-red-500' : 'bg-blue-500'
            }`}>
        { subscriptionMutation?.isPending ? <LoaderPinwheel className='animate-spin text-white'/> :  channel.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  </main>
 
  <div className="flex justify-center space-x-4 mt-4">
        <button onClick={() => setTab('videos')} className={`px-4 py-2 ${tab === 'videos' && 'border-b-2 border-blue-500'}`}>Videos</button>
        <button onClick={() => setTab('posts')} className={`px-4 py-2 ${tab === 'posts' && 'border-b-2 border-blue-500'}`}>Posts</button>
        <button onClick={() => setTab('playlists')} className={`px-4 py-2 ${tab === 'playlists' && 'border-b-2 border-blue-500'}`}>Playlists</button>
      </div>
 
      {tab === 'playlists' && (
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Create Playlist
          </button>
        </div>
      )}

{showCreatePlaylist && tab === 'playlists' && (
        <div className="p-4">
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist Name"
              className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
              value={playlistData.name}
              onChange={(e) => setPlaylistData({ ...playlistData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Playlist Description"
              className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
              value={playlistData.description}
              onChange={(e) => setPlaylistData({ ...playlistData, description: e.target.value })}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {createPlaylistMutation.isLoading ? 'Creating...' : 'Create Playlist'}
            </button>
          </form>
        </div>
      )}
 
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 ">
    {tab == 'videos' && videosLoading && <Shimmer/> }
    { tab == 'videos' && channelVideos?.map((video) => (
     <Link to={`/video/${video?._id}`} key={video._id}  > <VideoCard video={video} /> </Link>
    ))}

    {tab == 'posts' && postsLoading && <p>Posts are Loading</p>}
    {tab == 'posts' && posts?.map((post) => (
      <Postcard key={post?._id} post={post} />
    ))}


    {tab == 'playlists' && playlistsLoading && <p>Playlists are Loading</p>}
    {tab == 'playlists' && playlists?.map((playlist) => (
      <Link key={playlist?._id} to={`/playlist/${playlist?._id}` }> <PlaylistCard  playlist={playlist}  />  </Link>
    )) }

  </section>
  </>
  )
}

export default Channel
