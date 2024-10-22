import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { LoaderPinwheel} from 'lucide-react'
const Channel = () => {

  const {channelId} = useParams();
  const queryClient = useQueryClient();

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

  if (isLoading) return <div>Loading channel ...</div>
  if (isError) return <div>Loading channel error ...</div>

  return (
    <main className="p-5">
    <div className="flex flex-col items-center">
      {channel.coverImage?.url && (
        <img src={channel.coverImage.url} alt="cover" className="w-full h-60 object-cover rounded-lg mb-4" />
      )}
      <img src={channel.avatarImage?.url} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
      <h2 className="text-2xl font-bold mt-4">{channel.channelName}</h2>
      <p className="text-gray-400">{channel.userName}</p>
      <p className="mt-2">Subscribers: {channel.subscribersCount}</p>
      <p className="mt-2">Subscribed To: {channel.SubscribedToCount}</p>
      <button onClick={() => toggleSubscribe(channel._id)} className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold ${
              channel.isSubscribed ? 'bg-red-500' : 'bg-blue-500'
            }`}>
        { subscriptionMutation?.isPending ? <LoaderPinwheel className='animate-spin text-white'/> :  channel.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>

    </div>
  </main>
  )
}

export default Channel
