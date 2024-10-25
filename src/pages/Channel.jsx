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
import { useSelector } from 'react-redux';


const Channel = () => {

  const {channelId} = useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('videos');

  const user = useSelector((state) => state?.user?.user)
  

  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistData, setPlaylistData] = useState({ name: '', description: '' });

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

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

 const {data: channelVideos} = useQuery({
  queryKey: ['channelVideos', channelId],
  queryFn: async () => {
     const response = await axiosInstance.get(`/video/vids/${channelId}`);
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

const updatePlaylistMutation = useMutation({
  mutationFn: async (playlistData) => {
    const response = await axiosInstance.patch(`/playlist/update/${selectedPlaylist._id}`, playlistData);
    return response.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['channelPlaylist', channelId]);
    toast.success('Playlist updated successfully');
    setSelectedPlaylist(null);
  },
  onError: (error) => {
    toast.error(error?.response?.data?.message || 'Error updating playlist');
  },
});

const deletePlaylistMutation = useMutation({
  mutationFn: async (playlistId) => {
    const response = await axiosInstance.delete(`/playlist/delete/${playlistId}`);
    return response.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['channelPlaylist', channelId]);
    toast.success('Playlist deleted successfully');
  },
  onError: (error) => {
    toast.error(error?.response?.data?.message || 'Error deleting playlist');
  },
});
 
 const handleCreatePlaylist = (e) => {
  e.preventDefault();
  if (!playlistData.name) {
    return toast.error('Playlist name is required');
  }
  createPlaylistMutation.mutate({ ...playlistData, owner: channel?._id });
};

const handleUpdatePlaylist = (e) => {
  e.preventDefault();
  if (!playlistData.name) {
    return toast.error('Playlist name is required');
  }
  updatePlaylistMutation.mutate(playlistData);
};

const handleDeletePlaylist = (playlistId) => {
  if (window.confirm('Are you sure you want to delete this playlist?')) {
    deletePlaylistMutation.mutate(playlistId);
  }
};



  if (isLoading) return <div>Loading channel ...</div>
  if (isError) return <div>Loading channel error ...</div>

  return (
    <>
    <main className="p-5 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      
      <div className="flex flex-col items-center">
        {channel.coverImage?.url && (
          <img
            src={channel.coverImage.url}
            alt="cover"
            className="w-full h-60 md:h-72 lg:h-80 object-cover rounded-lg mb-4 shadow-md"
          />
        )}
        <img
          src={channel.avatarImage?.url}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <h2 className="text-3xl font-bold mt-4 text-gray-800">{channel.channelName}</h2>
        <p className="text-gray-500">{channel.userName}</p>
        <div className="flex gap-4 mt-2 text-gray-600">
          <p>Subscribers: {channel.subscribersCount}</p>
          <p>Subscribed To: {channel.SubscribedToCount}</p>
        </div>


        {user?.channelName !== channel.channelName ? (
  <>
    <button
      onClick={() => toggleSubscribe(channel._id)}
      className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
        channel.isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
      } shadow-md flex items-center justify-center`}
    >
      {subscriptionMutation?.isPending ? (
        <LoaderPinwheel className='animate-spin text-white mr-2' />
      ) : channel.isSubscribed ? (
        'Unsubscribe'
      ) : (
        'Subscribe'
      )}
    </button>

    
    {channel.isSubscribed ? (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-md shadow-md">
            <p className="font-semibold text-sm">Thank you for subscribing to {channel.channelName}!</p>
            <p className="text-xs">Enjoy the latest updates and content.</p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md shadow-md">
            <p className="font-semibold text-sm">Welcome to {channel.channelName}!</p>
            <p className="text-xs">Explore amazing content and subscribe for updates!</p>
          </div>
        )}
      </>
    ) : (
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md shadow-md">
        <p className="font-semibold text-sm">Hi, {user.userName}!</p>
        <p className="text-xs">You're viewing your channel. Keep creating!</p>
      </div>
    )}

      </div>
  
      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={() => setTab('videos')} className={`px-4 py-2 text-lg font-semibold ${tab === 'videos' && 'border-b-2 border-blue-500 text-blue-600'}`}>Videos</button>
        <button onClick={() => setTab('posts')} className={`px-4 py-2 text-lg font-semibold ${tab === 'posts' && 'border-b-2 border-blue-500 text-blue-600'}`}>Posts</button>
        <button onClick={() => setTab('playlists')} className={`px-4 py-2 text-lg font-semibold ${tab === 'playlists' && 'border-b-2 border-blue-500 text-blue-600'}`}>Playlists</button>
      </div>
  
      {tab === 'playlists' && (
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Playlist
          </button>
        </div>
      )}
  
      {showCreatePlaylist && tab === 'playlists' && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist Name"
              className="block w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={playlistData.name}
              onChange={(e) => setPlaylistData({ ...playlistData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Playlist Description"
              className="block w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={playlistData.description}
              onChange={(e) => setPlaylistData({ ...playlistData, description: e.target.value })}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {createPlaylistMutation.isLoading ? 'Creating...' : 'Create Playlist'}
            </button>
          </form>
        </div>
      )}
  
      {selectedPlaylist && tab === 'playlists' && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleUpdatePlaylist}>
            <input
              type="text"
              placeholder="Playlist Name"
              className="block w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={playlistData.name}
              onChange={(e) => setPlaylistData({ ...playlistData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Playlist Description"
              className="block w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={playlistData.description}
              onChange={(e) => setPlaylistData({ ...playlistData, description: e.target.value })}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {updatePlaylistMutation.isLoading ? 'Updating...' : 'Update Playlist'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlaylist(null)}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
  
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100">
        {tab === 'videos' && channelVideos?.map((video) => (
          <Link to={`/video/${video?._id}`} key={video._id}>
            <VideoCard video={video} />
          </Link>
        ))}
  
        {tab === 'posts' && postsLoading && <p className="text-center col-span-full">Posts are Loading</p>}
        {tab === 'posts' && posts?.map((post) => (
          <Postcard key={post?._id} post={post} />
        ))}
  
        {tab === 'playlists' && playlistsLoading && <p className="text-center col-span-full">Playlists are Loading</p>}
        {tab === 'playlists' && playlists?.map((playlist) => (
          <div key={playlist?._id} className="m-4 border border-gray-300 shadow-lg rounded-lg overflow-hidden flex flex-col bg-white">
            <Link to={`/playlist/${playlist?._id}`} className="hover:opacity-90 transition-opacity duration-200">
              <PlaylistCard playlist={playlist} />
            </Link>
  
            <div className="flex gap-3 justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setSelectedPlaylist(playlist);
                  setPlaylistData({ name: playlist.name, description: playlist.description });
                }}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Edit
              </button>
  
              <button
                onClick={() => handleDeletePlaylist(playlist._id)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  </>
  
  )
}

export default Channel
