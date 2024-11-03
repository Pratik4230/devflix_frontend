import  { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

import Comment from './Comment';

const CommentSection = ({ videoId }) => {
 
  const [sortBy, setSortBy ] = useState('createdAt')
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
 

  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['comments', videoId, sortBy],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comment/video/${videoId}?sortType=${sortBy}`);
      return response.data;
    },
    refetchInterval: 10000,
    onError: () => {
      toast.error("comment error")
      
    }
  });

  const addComment = useMutation({
    mutationFn: async (content) => {
      const response = await axiosInstance.post(`/comment/add/${videoId}`, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', videoId, sortBy]);
      toast.success('Comment added successfully');
      setNewComment('');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  

  

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment.mutate(newComment);
    }
  };

  

  if (isLoading) return <div>Loading comments...</div>;
  if (isError) return <div>Error loading comments</div>;


  const handleSort = (e) => {
    setSortBy(e.target.value);
 
  }

  return (
    <section className="w-screen mt-5 flex flex-col items-center">
      <h2 className="text-2xl text-yellow-50 font-semibold">Comments</h2>

      <div className="mt-3 lg:w-1/2">
        <textarea
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>

      <div className="mt-5 bg-slate-950 text-slate-300 rounded-xl p-2 w-10/12 lg:w-1/2">
        <div>
          <select onChange={handleSort} value={sortBy} className="p-2 rounded-md bg-slate-800 text-slate-200">
            <option value="createdAt">Newest First</option>
            <option value="likeCount">Most Popular</option>
          </select>
        </div>

        


        {!comments?.[0]?.key ? (
          <p>No comments Found</p>
        ) : (
          comments?.map((comment) => (
         
              <Comment key={comment?.key} comment={comment} />
            
             
               
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
