import React from 'react'

const Postcard = ({post}) => {
 
  const {content, createdAt, likes, } = post;
  const {channelName , avatarImage} = post?.ownerDetails;
  

  return (
    <div className="bg-white shadow-lg rounded-md p-4 max-w-md mx-auto transition-transform transform hover:scale-105 hover:shadow-xl">
  <div className="flex items-center mb-4">
    {avatarImage?.url && (
      <img src={avatarImage.url} alt={channelName} className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-blue-500" />
    )}
    <div>
      <h3 className="text-xl font-semibold text-gray-800">{channelName}</h3>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  </div>

  <p className="text-gray-700 mb-4">{content}</p>

  <div className="flex justify-between items-center border-t pt-2 border-gray-200">
    <p className="text-gray-500">Likes: {likes}</p>
    <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
      Like
    </button>
  </div>
</div>

  )
}

export default Postcard
