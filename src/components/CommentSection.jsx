import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const CommentSection = ({ videoId }) => {

  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const {data:comments, isLoading , isError} = useQuery({
    queryKey: ['comments' , videoId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/comment/video/${videoId}`);
      return response.data;
    }
  });

  const addComment = useMutation({
    mutationFn: async (content) => {
      const response = await axiosInstance.post(`/comment/add/${videoId}`, {content});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments' , videoId]);
      toast.success("Comment added successfully");
      setNewComment('');
    },
    onError: (error) => {
      toast.error('failed to add comment')
    }
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({commentId, content}) => {
      console.log(commentId)
      
      const response = await axiosInstance.patch(`/comment/update/${commentId}` , {content});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', videoId]);
      toast.success('comment updated successfully');
      setEditingCommentId(null);
      setEditingContent('')
    },
    onError: (error) => {
      console.log(error)
      
      toast.error(`Failed to update comment: ${error?.response?.data?.message} `)
    }
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
      console.log(error);
      
      toast.error(`Failed to delete comment ${error?.response?.data?.message} `);
    },
  });

  if (isLoading) return <div>Loading comments...</div>
  if (isError) return <div>Error loading comments</div>

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment.mutate(newComment)
    }
  }

  const handleUpdateComment = (commentId) => {
    if (editingContent.trim()) {
      updateCommentMutation.mutate({ commentId, content: editingContent });
    }
  }
 
  return (
     <section className='w-screen mt-5 flex flex-col items-center '> 
     {console.log(comments) }
      <h2 className='text-2xl text-yellow-50 font-semibold'>Comments</h2>

      <div className='mt-3 lg:w-1/2'>
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

      <div className='mt-5 bg-slate-950  text-slate-300 rounded-xl p-2 w-10/12 lg:w-1/2'>
        {comments?.map((comment) => (
          <div key={comment.key} className='my-3 border-b-2  p-2 px-4 w-full'>
            <div className='flex items-center  gap-3 '>
              <img src={comment.avatar} alt={comment.channelName} className='w-10 h-10 rounded-full' />
              <p className="font-semibold">{comment.channelName}</p>
            </div>
            <p className="mt-1 text-slate-50">{comment.content}</p>

{editingCommentId === comment.key ? (
  <div className='mt-2'>
    <textarea  className="w-full border border-gray-300 p-2 rounded-md"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                 <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                  onClick={() => handleUpdateComment(comment.key)}
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
      setEditingCommentId(comment.key);
      setEditingContent(comment.content);
    }}
  >
    Edit
    </button>
    <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md ml-2"
                  onClick={() => deleteCommentMutation.mutate(comment.key)}
                >
                  Delete
                </button>
                </div>
) }

          </div>
        ))}

      </div>

     </section>
  );
}


export default CommentSection;