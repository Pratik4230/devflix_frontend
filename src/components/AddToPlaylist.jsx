import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const AddToPlaylist = ({ videoId }) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  
 console.log("fiii from addot");
 

  // Fetch all playlists of the current user (you may have this query elsewhere)
//   const { data: playlists, isLoading: playlistsLoading } = useQuery({
//     queryKey: ['playlists'],
//     queryFn: async () => {
//       const response = await axiosInstance.get('/playlist/user-playlists'); // Adjust according to your API
//       return response?.data?.data;
//     },
//     staleTime: 1000 * 60 * 10,
//   });

  // Mutation to add a video to a playlist
//   const mutation = useMutation({
//     mutationFn: async () => {
//       const response = await axiosInstance.post(`/playlist/${selectedPlaylistId}/add-video/${videoId}`);
//       return response?.data;
//     },
//     onSuccess: () => {
//       toast.success('Video added to playlist successfully');
//     },
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || 'Failed to add video to playlist');
//     },
//   });

  // Handle the playlist selection and add video
  const handleAddToPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    mutation.mutate();
  };

  if (playlistsLoading) return <p>Loading playlists...</p>;

  return (
    <div>
      <p>Select a playlist to add this video:</p>
      <ul>
        {playlists?.map((playlist) => (
          <li key={playlist._id} className="flex items-center gap-4 my-2">
            <span>{playlist.name}</span>
            <button
              onClick={() => handleAddToPlaylist(playlist._id)}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add to Playlist
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddToPlaylist;
