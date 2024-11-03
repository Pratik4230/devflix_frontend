import {useQuery , useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../utils/axiosInstance"
import toast from "react-hot-toast";
import { useState } from "react";
import { useSelector } from "react-redux";
import Shimmer from "../components/Shimmer";
import { Link } from "react-router-dom";
import Videocarrd from "../components/Videocarrd";
import { LoaderPinwheel } from "lucide-react";



const MyVideos = () => {

  const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [isEdit , setIsEdit] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState(null);
    

    const user = useSelector((state) => state?.user?.user);
   const channelId = user?._id;

   const queryClient = useQueryClient();
    

    const { data: myVideos = [], isLoading: myVideosLoading, isError: myVideosError } = useQuery({
      queryKey: ['myVideos', channelId],
      queryFn: async () => {
        const response = await axiosInstance.get('/video/manage');
        return response?.data || [];
      },
      staleTime: 1000 * 60 * 5,
    });

  const videoUpload = useMutation({
    mutationFn: async (formData) => {      
      const response = await axiosInstance.post("/video/upload", formData);    
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['myVideos', channelId])
      toast.success(data?.message || "video uploaded successfully");
    },
    onError: (error) => {
      console.log("error uploading video", error?.response?.data);
      toast.error(error?.response?.data)
    }
  });

  const videoUpdate = useMutation({
    mutationFn: async ({ videoId, formData }) => {
        const response = await axiosInstance.patch(`/video/update/${videoId}`, formData);
        return response.data;
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries(['myVideos', channelId]);
        toast.success(data?.message || "Video updated successfully");
        resetUpdateForm();
    },
    onError: (error) => {
        console.log('Error updating video:', error);
        toast.error(error?.response?.data || "Video update error");
    },
});

const videoDelete = useMutation({
  mutationFn: async (videoId) => {
      const response = await axiosInstance.delete(`/video/delete/${videoId}`);
      return response.data;
  },
  onSuccess: (data) => {
      queryClient.invalidateQueries(['myVideos', channelId]);
      toast.success(data?.message || "Video deleted successfully");
  },
  onError: (error) => {
      console.log("Error deleting video:", error);
      toast.error(error?.response?.data || "Failed to delete video");
  }
});

const togglePublish = useMutation({
  mutationFn: async (videoId) => {
    const response = await axiosInstance.patch(`/video/togglepublish/${videoId}`);
    return response.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['myVideos', channelId]);
    toast.success(data?.message || "Video publish status toggled successfully");
   
    
  },
  onError: (error) => {
    toast.error(error?.response?.data || "Failed to toggle publish status");
  },
});

  const handleUpload = (e) => {
    e.preventDefault();


    if (videoFile && videoFile.size > 100 * 1024 * 1024) {
      toast.error("Video file is too large. Maximum size is 100 MB.");
      return;
    }


    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    videoUpload.mutate(formData);
    
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile); 
    }

    videoUpdate.mutate({ videoId: currentVideoId, formData }); 
  
    
};

const resetUpdateForm = () => {
  setTitle('');
  setDescription('');
  setVideoFile(null);
  setThumbnailFile(null);
  setIsEdit(false);
  setCurrentVideoId(null); 
};

const handleEditClick = (video) => {
  setIsEdit(!isEdit);
  setCurrentVideoId(video._id);
  setTitle(video.title);
  setDescription(video.description);
 
};

const handleDeleteClick = (videoId) => {
  if (window.confirm("Are you sure you want to delete this video?")) {
      videoDelete.mutate(videoId);
  }
};
  
const handleTogglePublish = (videoId) => {
  togglePublish.mutate(videoId);
};

  if (myVideosLoading) return <Shimmer/>

  

  return (
    <main>
    <div className="m-5 max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
    <h2 className="text-2xl font-semibold mb-4 text-center">Upload Video</h2>
    <form onSubmit={handleUpload} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            ></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Video File</label>
            <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail File</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
        </div>
        <button
            type="submit"
            disabled={videoUpload.isPending}
            className="w-full py-2 px-4 rounded-md text-white font-semibold  bg-blue-600 hover:bg-blue-700 transition duration-200 "
        >
            {videoUpload.isPending ? <LoaderPinwheel className="animate-spin text-white" /> : 'Upload Video'}
        </button>
        {videoUpload.error && (
            <div className="text-red-600 text-sm text-center">{videoUpload.error.message}</div>
        )}
    </form>
</div>

 { isEdit && 
   <div className="max-w-lg mx-auto p-5 bg-white rounded-lg shadow-md">
   <h2 className="text-xl font-bold mb-4">Update Video</h2>
   <form onSubmit={handleUpdate}>
       <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700">Title</label>
           <input
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               required
               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
           />
       </div>
       <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700">Description</label>
           <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               required
               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
           ></textarea>
       </div>
       <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700">Thumbnail File (optional)</label>
           <input
               type="file"
               accept="image/*"
               onChange={(e) => setThumbnailFile(e.target.files[0])}
               className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
           />
       </div>
       <button 
           type="submit" 
           disabled={videoUpdate.isPending} 
           className="w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all"
       >
           {videoUpdate.isPending ? <LoaderPinwheel className="animate-spin text-white" /> : 'Update Video'}
       </button>
       {videoUpdate.error && <div className="mt-2 text-red-600">{videoUpdate.error.message }</div>}
   </form>
</div>
 }
 

   
 <div className="my-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Manage Videos</h2>
        {!myVideos?.videos ?  (
           <p className="text-lg flex flex-wrap justify-center font-semibold bg-slate-100 p-5 text-blue-600">You can start uploading videos for your channel.</p> 
          ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myVideos?.videos?.map((video) => (
            <div key={video._id} className="relative p-4 bg-white shadow-lg rounded-lg">
           <Link to={`/video/${video._id}`} className=" hover:underline">   <Videocarrd video={video} /> </Link>
              <div className="mt-2 flex justify-between">
             
               
                <button 
                  onClick={() => handleEditClick(video)} 
                  className="text-yellow-600 hover:underline">Edit</button>
             
             <button onClick={() => handleTogglePublish(video._id)} className={`${video.isPublished ? 'text-green-600' : 'text-gray-600'} hover:underline`}>
                  {video.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                  
                  
             <button onClick={() => handleDeleteClick(video._id)}className="text-red-600 hover:underline">
                Delete
             </button>

              </div>
            </div>
          ))}
        </div>
        )}
      </div>
  

    </main>
  )
}

export default MyVideos
