import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../utils/axiosInstance'
import VideoCard from '../components/VideoCard'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const Playlist = () => {

  const {playlistId} = useParams();
 const user = useSelector((state) => state?.user?.user)
  const [playlistData, setPlaylistData] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  

  const{data: playlist, isLoading: playlistLoading} = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/playlist/playlist/${playlistId}`);
      return response?.data;
    },
    staleTime: 1000*60*10,
    onSuccess: () => {
      toast.success(playlist?.message || "playlist fetched successfully");
      
    },
    onError: (error) => {
      toast.error( error?.response?.data?.message || "something went wrong")
    }
    
  });

  const updatePlaylistMutation = useMutation({
    mutationFn: async (playlistData) => {
      const response = await axiosInstance.patch(`/playlist/update/${playlistId}`, playlistData);
      console.log("mutation update");
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['playlist', playlistId]);
      toast.success('Playlist updated successfully');
      setIsEditing(false)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error updating playlist');
    },
  });

  const deletePlaylistMutation = useMutation({
    mutationFn: async (playlistId) => {
      const response = await axiosInstance.delete(`/playlist/delete/${playlistId}`);
      console.log("delete mutation");
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['playlist', playlistId]);
      toast.success('Playlist deleted successfully');
      console.log("delete suceess");
       navigate(`/channel/${channelId}`, {replace:true})
       console.log("delete navigate");

       
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error deleting playlist');
    },
  });


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
      console.log("handle delete");
      
    }
  };

  
  
  if (playlistLoading)  return <p>playlist Loading</p>

  console.log("cur user " , user);
  console.log("hii" ,playlist?.data[0]?.videoData[0]?.ownerDetails?.channelName);

  const playlistOwner = playlist?.data[0]?.videoData[0]?.ownerDetails?.channelName;
  
  

  useEffect(() => {
    if (user?.channelName && playlistOwner) {
      setIsOwner( user?.channelName === playlistOwner);
    }
  }, [playlistOwner]); 
  console.log(isOwner);

 
  

  if (!playlist || !playlist?.data[0]?.videoData) {
    return <p className='  flex justify-center  border-b-2 border-b-lime-400 text-lg p-2'>Playlist is empty!!! Please add some videos in Playlist </p>; 
  }

 const {name, description, createdAt} = playlist?.data[0]?.playlistData;

// console.log("pl",playlist);

  return (
    <main className="bg-gray-50 min-h-screen">
  <section className='flex flex-col items-center mt-10 mb-5 p-4 bg-white shadow-md rounded-lg relative'>
    <h1 className='font-bold text-3xl text-gray-800'>{name}</h1>
    <p className='text-lg text-gray-600 mt-2'>{description}</p>
    <p className='text-gray-500 mt-1'>{new Date(createdAt).toLocaleDateString()}</p>

{ isOwner &&
    <div className="flex flex-col gap-2  p-2 border-t border-gray-200 bg-gray-50 absolute right-0 lg:right-3 bottom-0">
             
               <button
                onClick={() => setIsEditing(!isEditing) }
                className="p-1.5  bg-blue-500 text-white lg:font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              > 
                Edit
              </button>

              <button
                onClick={() => handleDeletePlaylist(playlistId)}
                className="p-1.5 bg-red-500 text-white lg:font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
              >
                Delete
              </button>
             
            </div>}


  </section>

  <section>



    
{ isEditing && 
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
             onClick={() => setIsEditing(false)}
             className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
           >
             Cancel
           </button>
         </form>
       </div>}
     
  </section>

  <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pt-6">
    {playlist?.data[0]?.videoData?.map((video) => (
      <Link to={`/playlist/${playlist?._id}/video/${video?._id}`} key={video?._id}>
        <VideoCard video={video} currentPlaylist={playlistId} />
      </Link>
    ))}
  </section>
</main>

  )
}

export default Playlist
