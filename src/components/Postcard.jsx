import React, { useMemo } from 'react'
import { ThumbsUp } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const Postcard = ({post}) => {
 
  const {content, createdAt, likes, } = post;
  const {channelName , avatarImage} = post?.ownerDetails;

  const queryClient = useQueryClient();



  const channelId =post?.channelId
  


  
  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axiosInstance.post(`/like/post/${postId}`);
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(['channelPosts', channelId],)
      
      
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "failed like")
    }
  })
  

  const handleLike = (postId) => {

likeMutation.mutate(postId);

  }

 const isLiked = useMemo(() => likeMutation?.data?.isLiked, [likeMutation] )

  
  

  return (
    <div className="bg-white dark:bg-black  shadow-lg rounded-lg p-6 max-w-md mx-auto transition-transform transform hover:scale-105 hover:shadow-2xl">
  <div className="flex items-center mb-6">
    {avatarImage?.url && (
      <img
        src={avatarImage.url}
        alt={channelName}
        className="w-14 h-14 rounded-full mr-4 object-cover border-4 border-blue-400"
      />
    )}
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-50">{channelName}</h3>
      <p className="text-xs text-gray-400 dark:text-gray-100">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  </div>

  <p className="text-gray-700 dark:text-gray-100 mb-5 leading-relaxed">{content}</p>

  <div className="flex justify-between items-center border-t pt-4 border-gray-100">
    <p className="text-sm text-gray-500 dark:text-fuchsia-50 font-medium">❤️ {likes} Likes</p>
    <button onClick={ () => handleLike(post?._id)} className= { `px-4 py-2 text-sm font-semibold text-white  rounded-full shadow hover:bg-blue-800 hover:shadow-lg transition duration-200 ${isLiked ? `bg-blue-600` : `bg-slate-800`}`  }>
    <ThumbsUp  />
    </button>
  </div>
</div>


  )
}

export default Postcard
