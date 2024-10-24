import React from 'react'

const Postcard = ({post}) => {
 
  const {content, createdAt, likes, } = post;
  const {channelName , avatarImage} = post?.ownerDetails;
  

  return (
    <div className="bg-white shadow-lg rounded-md p-4">
   
    <div className="flex items-center mb-4">
      {avatarImage?.url && (
        <img src={avatarImage.url} alt={channelName} className="w-10 h-10 rounded-full mr-3 object-cover" />
      )}
      <div>
        <h3 className="text-lg font-semibold">{channelName}</h3>
        <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>

   
    <p className="text-gray-700 mb-4">{content}</p>

    
    <div className="flex justify-between items-center">
      <p className="text-gray-500">Likes: {likes}</p>
     
    </div>
  </div>
  )
}

export default Postcard
