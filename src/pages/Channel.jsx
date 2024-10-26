import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import React, { useEffect, useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { axiosInstance } from '../utils/axiosInstance'; 
import toast from 'react-hot-toast'; 
import { LoaderPinwheel } from 'lucide-react'; 
import Shimmer from '../components/Shimmer'; 
import VideoCard from '../components/VideoCard'; 
import Postcard from '../components/Postcard'; 
import PlaylistCard from '../components/PlaylistCard'; 
import { useSelector } from 'react-redux';

const Channel = () => {
  const { channelId } = useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('videos');
 
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistData, setPlaylistData] = useState({ name: '', description: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const [isOwner, setIsOwner] = useState(false);

  const user = useSelector((state) => state?.user?.user);
 

  const { data: channel, isLoading, isError } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/channel/${channelId}`);
      return response.data.data || {};
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error fetching channel");
    }
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (channel) => {
      const response = await axiosInstance.post(`/subscription/subscribe/${channel}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['channel', channelId]);
      toast.success(data?.message || "Subscribed successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Subscription error");
    }
  });

  const toggleSubscribe = (id) => {
    subscriptionMutation.mutate(id);
  };

  const { data: channelVideos = [], isLoading: channelVideosLoading, isError: channelVideosError } = useQuery({
    queryKey: ['channelVideos', channelId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/video/vids/${channelId}`);
      return response?.data || [];
    },
    enabled: tab === 'videos',
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['channelPosts', channelId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/post/channel/${channelId}`);
      return response?.data || [];
    },
    enabled: tab === 'posts',
  });

  const { data: playlists = [], isLoading: playlistsLoading, isError: playlistError } = useQuery({
    queryKey: ['channelPlaylist', channelId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/playlist/playlists/${channelId}`);
      return response?.data || [];
    },
    onSuccess: (data) => {
    toast.success(data?.message)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
    enabled: tab === 'playlists'
  });

  
  useEffect(() => {
    if (user?._id && channel?._id) {
      setIsOwner(user._id === channel._id);
    }
  }, [user, channel]); 

  
  const createPlaylistMutation = useMutation({
    mutationFn: async (playlistData) => {
      const response = await axiosInstance.post('/playlist/create', playlistData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelPlaylist', channelId]);
      toast.success('Playlist created successfully');
      setShowCreatePlaylist(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error creating playlist');
    }
  });

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!playlistData.name) return toast.error('Playlist name is required');
    createPlaylistMutation.mutate({ ...playlistData, owner: channel?._id });
  };


  const createPostMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/post/create', { content: newPostContent });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelPosts', channelId]);
      toast.success('Post created successfully!');
      setShowCreatePost(false);
      setNewPostContent('');
    },
    onError: (error) => toast.error(error?.response?.data?.message || 'Error creating post'),
  });


  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, content }) => {
      return await axiosInstance.patch(`/post/update/${postId}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelPosts', channelId]);
      toast.success('Post updated successfully!');
      setEditingPostId(null);
    },
    onError: () => {
      toast.error('Error updating post');
    },
  });


  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      return await axiosInstance.delete(`/post/delete/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelPosts', channelId]);
      toast.success('Post deleted successfully!');
    },
    onError: () => {
      toast.error('Error deleting post');
    },
  });



  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent) return toast.error('Content is required');
    createPostMutation.mutate();
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    
  };

  const handleUpdatePost = (postId) => {
    if (!editedContent.trim()) {
      toast.error('Content cannot be empty');
      return;
    }
    updatePostMutation.mutate({ postId, content: editedContent });
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };
 

  if (isLoading || channelVideosLoading || playlistsLoading) return <Shimmer />;
  if (isError || channelVideosError || playlistError) return <div>Error loading channel data</div>;

  return (
    <main className="p-5 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <div className="flex flex-col items-center">
        {channel.coverImage?.url && (
          <img src={channel.coverImage.url} alt="cover" className="w-full h-60 md:h-72 lg:h-80 object-cover rounded-lg mb-4 shadow-md" />
        )}
        <img src={channel.avatarImage?.url} alt="avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
        <h2 className="text-3xl font-bold mt-4 text-gray-800">{channel.channelName || 'Channel Name Unavailable'}</h2>
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

      {tab === 'posts' && isOwner && (
        <div className="flex flex-col items-center mt-4">
          <button onClick={() => setShowCreatePost(!showCreatePost)} className="px-4 py-2 bg-green-500 text-white rounded-lg">
            {showCreatePost ? 'Cancel' : 'Create Post'}
          </button>

          {showCreatePost && (
            <form onSubmit={handleCreatePost} className="w-full max-w-md mt-4">
              <textarea
                placeholder="Write your post content here..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2">
                {createPostMutation.isLoading ? 'Creating...' : 'Create Post'}
              </button>
            </form>
          )}

        </div>
      )}


      {tab === 'playlists' && isOwner && (
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Playlist
          </button>
        </div>
      )}

{  showCreatePlaylist && tab === 'playlists' && isOwner && (
        <div className= "p-4 bg-white rounded-lg shadow-md" >
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




      <section className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100">
        
        {tab === 'videos' && channelVideos?.videos?.map((video) => (
          <Link to={`/video/${video?._id}`} key={video?._id}>
            <VideoCard video={video} />
          </Link>
        ))}
        {tab === 'posts' && postsLoading && <p>Loading posts...</p>}
        {tab === 'posts' && posts.map((post) => (
         <div
           key={post._id}
           className="relative border border-gray-200  p-6 rounded-lg bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
         >
           {editingPostId === post._id ? (
             <>
               <textarea
                 value={editedContent}
                 onChange={(e) => setEditedContent(e.target.value)}
                 className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring focus:ring-blue-200"
               />
               <div className="flex space-x-3 mt-3">
                 <button
                   onClick={() => handleUpdatePost(post._id)}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
                 >
                   Save
                 </button>
                 <button
                   onClick={() => setEditingPostId(null)}
                   className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                 >
                   Cancel
                 </button>
               </div>
             </>
           ) : (
             <>
               <Postcard post={post} />
               {isOwner && (
                 <div className="flex justify-end space-x-4 mt-4">
                   <button
                     onClick={() => handleEditClick(post)}
                     className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                   >
                     Edit
                   </button>
                   <button
                     onClick={() => handleDeletePost(post._id)}
                     className="text-red-600 hover:text-red-700 font-medium transition-colors"
                   >
                     Delete
                   </button>
                 </div>
               )}
             </>
           )}
         </div>
       ))}
  


        {tab === 'playlists' && playlistsLoading && <p>Loading playlists...</p>}
        
        {tab === 'playlists' && playlists?.data?.length === 0 ? (
          <p className=' text-blue-600 border-l-4 border-l-red-400 p-0.5 border-b-2 border-b-lime-500'>{isOwner ? "create playlist and add videos in Playlist" : "No playlist found only owner can create playlist"}</p>
        ) : (
          
          tab === 'playlists' && playlists?.data?.map((playlist) => (
            
            <div key={playlist?._id} className="m-4 border border-gray-300 shadow-lg rounded-lg overflow-hidden flex flex-col bg-white">
            
              
            <Link to={`/playlist/${playlist?._id}`} className="hover:opacity-90 transition-opacity duration-200">
              <PlaylistCard playlist={playlist} />
            </Link>
  
            
          </div>

          ))
        )}
      </section>
    </main>
  );
};

export default Channel;
