import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import  { useState } from 'react';
import { axiosInstance } from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { Edit3 , LoaderPinwheel } from 'lucide-react'

const Profile = () => {
  const queryClient = useQueryClient();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null); 
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

 
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/profile');
      return response?.data?.data;
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error fetching profile');
    },
  });


  const updatePasswordMutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const response = await axiosInstance.patch('/user/updatepassword', { oldPassword, newPassword });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setIsUpdatingPassword(false)
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to update password');
    },
  });

  
  const updateAvatarImageMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.patch('/user/updateavatarimage', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('profile');
      toast.success('Profile image updated successfully!');
      setAvatarImage(null);
      setIsEditingAvatar(false)
    },
    onError: (error) => {
    
      
      toast.error(error.response?.data || 'Failed to update profile image');
    },
  });

 
  const updateCoverImageMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.patch('/user/updatecoverimage', formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('profile'); 
      toast.success('Cover image updated successfully!');
      setCoverImage(null);
      setIsEditingCover(false)
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to update cover image');
    },
  });

 
  const handleUpdatePassword = () => {
    if (newPassword && oldPassword) {
      updatePasswordMutation.mutate({ oldPassword, newPassword });
    } else {
      toast.error('Both old and new passwords are required.');
    }
  };


  const handleUpdateAvatarImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (avatarImage) {
      formData.append('avatar', avatarImage);
      updateAvatarImageMutation.mutate(formData);
    } else {
      toast.error('Please select an image to upload.');
    }
  };


  const handleUpdateCoverImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (coverImage) {
      formData.append('coverImage', coverImage);
      updateCoverImageMutation.mutate(formData);
    } else {
      toast.error('Please select an image to upload.');
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error loading profile</div>;

  return (
    <main className="p-5 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
  <div className="mb-5">
    {profile.coverImage?.url && (
      <div className="relative mb-5">
        <img
          src={profile.coverImage.url}
          alt="cover"
          className="w-full h-56 md:h-72 lg:h-80 object-cover rounded-lg shadow-lg"
        />
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          onClick={() => setIsEditingCover(!isEditingCover)}
        >
          <Edit3 className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    )}
  </div>

  <section className="flex flex-col md:flex-row justify-between items-center mb-5 bg-white rounded-lg shadow-md p-4">
    <div className="flex items-center gap-4 mb-5 relative">
      <img
        src={profile.avatarImage?.url}
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg"
      />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{profile.channelName}</h2>
        <p className="text-gray-600">{profile.userName}</p>
      </div>
      <button
        className="absolute top-16 left-16 bg-white p-1 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
        onClick={() => setIsEditingAvatar(!isEditingAvatar)}
      >
        <Edit3 className="w-4 h-4 text-blue-600" />
      </button>
    </div>

    <div className="profile-info mt-5 text-gray-800">
      <p className="text-lg">
        <span className="font-semibold">Email: {profile.emailId}</span>
      </p>
      <p className="font-thin">
        <span className="text-base">Account Created: {new Date(profile.createdAt).toLocaleDateString()}</span>
      </p>
      <p className="font-extralight">
        <span className="text-base">Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}</span>
      </p>
      <p
        onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}
        className="bg-blue-700 text-white text-lg p-2 flex justify-center my-3 rounded-xl cursor-pointer hover:bg-blue-600 transition"
      >
        Update Password
      </p>
    </div>
  </section>

  {isUpdatingPassword && (
    <section className="mt-5 bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">Update Password</h3>
      <input
        type="password"
        placeholder="Old Password"
        className="border border-gray-300 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        className="border border-gray-300 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handleUpdatePassword}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-3 transition-transform transform hover:scale-105"
      >
        {updatePasswordMutation.isPending ? <LoaderPinwheel className="animate-spin text-white" /> : "Update Password"}
      </button>
    </section>
  )}

  {isEditingAvatar && (
    <section className="mt-5 bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">Update Profile Image</h3>
      <input
        type="file"
        className="border border-gray-300 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setAvatarImage(e.target.files[0])}
      />
      <button
        onClick={handleUpdateAvatarImage}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-3 transition-transform transform hover:scale-105"
      >
        {updateAvatarImageMutation.isPending ? <LoaderPinwheel className="animate-spin text-white" /> : "Update Profile Image"}
      </button>
    </section>
  )}

  {isEditingCover && (
    <section className="mt-5 bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">Update Cover Image</h3>
      <input
        type="file"
        className="border border-gray-300 p-2 w-full mt-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setCoverImage(e.target.files[0])}
      />
      <button
        onClick={handleUpdateCoverImage}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-3 transition-transform transform hover:scale-105"
      >
        {updateCoverImageMutation.isPending ? <LoaderPinwheel className="animate-spin text-white" /> : "Update Cover Image"}
      </button>
    </section>
  )}
</main>


  );
};

export default Profile;
