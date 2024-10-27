import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ThumbsUp } from 'lucide-react';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const Comment = ({ comment }) => {

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const {avatar, channelName, content, createdAt , key, likeCount , videoId } = comment

  const user = useSelector((state) => state?.user?.user);

  const queryClient = useQueryClient();

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      const response = await axiosInstance.patch(`/comment/update/${commentId}`, { content }); 
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', videoId]);
      toast.success('Comment updated successfully');      
      setEditingCommentId(null);
      setEditingContent('');
    },
    onError: (error) => {  
      toast.error(`Failed to update comment: ${error?.response?.data}`);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await axiosInstance.delete(`/comment/delete/${commentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', videoId]);
      toast.success('Comment deleted successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "failed to delete comment");
    },
  });

  const handleUpdateComment = (commentId) => {
    if (editingContent.trim()) {
      updateCommentMutation.mutate({ commentId, content: editingContent });
    } 
  };

 const likeMutation = useMutation({
  mutationFn: async (cId) => {
    const response = await axiosInstance.post(`/like/comment/${cId}`);
    return response.data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['comments', videoId])
    toast.success(data.message);

  },
  onError: (error) => {
    toast.error("comment like error")
  }
 });

  const handleLike = (cId) => {
    likeMutation.mutate(cId)
    
    
  }
  
  

  return (
    <div className="my-3 border-b-2 p-2 px-4 w-full">
       <div className="flex items-center gap-3">
                <img src={avatar} alt={channelName} className="w-10 h-10 rounded-full" />
                <p className="font-semibold">{channelName}</p>
              </div>

              <p className=" flex gap-3 text-slate-50 my-2">{content} </p>

              <p className='flex gap-3 mb-3'> <span onClick={() => handleLike(key)}
                  // className={ `px-4 py-2 text-sm font-semibold text-white  rounded-full shadow hover:bg-blue-800 hover:shadow-lg transition duration-200 ${isLiked ? `bg-blue-600` : `bg-slate-800`}`  }
                   >
                    <ThumbsUp/></span>  <span>{likeCount}</span>  </p>
      

                    {user?.channelName === channelName && (
                <div className="mt-2">
                  {editingCommentId === key ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded-md"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                        onClick={() => handleUpdateComment(key)}
                      >
                        Update Comment
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                        onClick={() => {
                          setEditingCommentId(key);
                          setEditingContent(content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded-md ml-2"
                        onClick={() => deleteCommentMutation.mutate(key)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
    
      
    </div>
  );
};

export default Comment;
