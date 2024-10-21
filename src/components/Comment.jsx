import React from 'react';

const Comment = ({ avatar, channelName, content, createdAt }) => {
  return (
    <div className="flex gap-3 p-3 border-b border-gray-700">
      <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-lg">{channelName}</p>
          <p className="text-sm text-gray-400">{new Date(createdAt).toLocaleString()}</p>
        </div>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Comment;
