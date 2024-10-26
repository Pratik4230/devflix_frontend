import React from 'react'

const Postcard = ({post}) => {
 
  const {content, createdAt, likes, } = post;
  const {channelName , avatarImage} = post?.ownerDetails;
  

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto transition-transform transform hover:scale-105 hover:shadow-2xl">
  <div className="flex items-center mb-6">
    {avatarImage?.url && (
      <img
        src={avatarImage.url}
        alt={channelName}
        className="w-14 h-14 rounded-full mr-4 object-cover border-4 border-blue-400"
      />
    )}
    <div>
      <h3 className="text-lg font-bold text-gray-800">{channelName}</h3>
      <p className="text-xs text-gray-400">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  </div>

  <p className="text-gray-700 mb-5 leading-relaxed">{content}</p>

  <div className="flex justify-between items-center border-t pt-4 border-gray-100">
    <p className="text-sm text-gray-500 font-medium">❤️ {likes} Likes</p>
    <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full shadow hover:bg-blue-600 hover:shadow-lg transition duration-200">
      Like
    </button>
  </div>
</div>


  )
}

export default Postcard
