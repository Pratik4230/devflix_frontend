import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import Shimmer from '../components/Shimmer';
import CommentSection from '../components/CommentSection';
import { LoaderPinwheel, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Video = () => {
  const { videoId, playlistId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);


  const user = useSelector((state) => state?.user?.user);

  const { data: video, isLoading, isError } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => (await axiosInstance.get(`/video/vid/${videoId}`)).data,
    onError: () => toast.error('Error fetching video'),
  });

  const { data: playlists, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => (await axiosInstance.get(`/playlist/playlists/${user?._id}`)).data,
    onError: () => toast.error('Error fetching playlists'),
  });

  const addToPlaylistMutation = useMutation({
    mutationFn: async ({ playlistId, videoId }) => (await axiosInstance.post(`/playlist/addvideo/${playlistId}/${videoId}`)).data,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['playlists']);
    },
    onError: (error) => toast.error(error?.response?.data || 'Error adding video to playlist'),
  });

  const removeVideoFromPlaylist = useMutation({
    mutationFn: async () => (await axiosInstance.post(`/playlist/removevideo/${playlistId}/${videoId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      toast.success("Video removed successfully");
      navigate(`/playlist/${playlistId}`, { replace: true });
    },
    onError: () => toast.error('Error removing video from playlist'),
  });

  const handleAddToPlaylist = () => selectedPlaylist && addToPlaylistMutation.mutate({ playlistId: selectedPlaylist, videoId });
  const handleRemoveVideo = (e) => {
    e.stopPropagation();
    removeVideoFromPlaylist.mutate();
  };

  if (isLoading||isLoadingPlaylists  ) return <Shimmer />;
  if (isError) return <p className="text-red-500">Error loading video</p>;

  const formattedDate = new Date(video.createdAt).toLocaleDateString();

  return (
    <main className="video-page flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-gray-200">
  <section className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 rounded-2xl overflow-hidden shadow-2xl mb-8 transform transition duration-300 hover:scale-105 hover:shadow-emerald-500/50">
    <video controls src={video.video} className="w-full h-auto aspect-video rounded-xl bg-black" />
  </section>

  <section className="bg-slate-800 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 p-6 rounded-2xl shadow-lg transition duration-300 hover:shadow-xl hover:bg-slate-700">
    <div className="text-white flex flex-col sm:flex-row justify-between items-start gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold">{video.title}</h1>
        <p className="text-sm sm:text-base text-gray-400">{video.views} views • {formattedDate}</p>

        <Link to={`/channel/${video?.channelId}`} className="flex items-center gap-3 mt-3 sm:mt-4 hover:underline">
          <img src={video.ownerAvatar} alt="owner avatar" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-700" />
          <p className="text-lg sm:text-xl font-semibold">{video.owner}</p>
        </Link>
      </div>

      <div className="space-y-2 mt-4 sm:mt-0">
        {!playlistId && (
          <button
            onClick={() => setShowAddToPlaylist(!showAddToPlaylist)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Add to Playlist
          </button>
        )}

        {showAddToPlaylist && (
          <div className="mt-2 bg-gray-800 p-4 rounded-xl shadow-md space-y-3 transition duration-300 hover:bg-gray-700">
            <p className="text-lg font-semibold text-gray-100">Select Playlist</p>
            {isLoadingPlaylists ? (
              <LoaderPinwheel className="animate-spin text-white mx-auto" />
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {console.log("playyy", playlists)
                }
                <select
                  className="p-2 rounded bg-gray-700 text-white w-full sm:w-auto focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                >
                  <option value="">Choose Playlist</option>
                  {playlists?.data?.map((playlist) => (
                    <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
                  ))}
                </select>

                <button
                  onClick={handleAddToPlaylist}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                  disabled={!selectedPlaylist }
                >
                  {addToPlaylistMutation.isLoading ? <LoaderPinwheel className="animate-spin text-white" /> : 'Add'}
                </button>
              </div>
            )}
          </div>
        )}

        {playlistId && (
          <button
            onClick={handleRemoveVideo}
            className="flex flex-col items-center text-red-500 mt-1 hover:text-red-600 transition transform hover:scale-110"
          >
            <Trash2 size={18} />
            <span className="text-sm">Remove</span>
          </button>
        )}
      </div>
    </div>

    <section className="bg-slate-700 p-4 rounded-lg mt-6 shadow-inner transition duration-300 hover:bg-slate-600">
      <input type="checkbox" id="toggleDesc" className="peer hidden" />
      <label htmlFor="toggleDesc" className="block text-lg font-semibold cursor-pointer text-white peer-checked:text-gray-400 hover:text-emerald-400">
        Show Description
      </label>
      <p className="text-sm text-gray-300 mt-3 hidden peer-checked:block">{video.description}</p>
    </section>
  </section>

  <CommentSection videoId={videoId} />
</main>


  );
};

export default Video;
