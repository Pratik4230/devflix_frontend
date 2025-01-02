import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Edit3, LoaderPinwheel } from "lucide-react";

const Profile = () => {
  const queryClient = useQueryClient();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const avatarInputRef = useRef();
  const coverInputRef = useRef();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/profile");
      return response?.data?.data;
    },
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error fetching profile");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const response = await axiosInstance.patch("/user/updatepassword", {
        oldPassword,
        newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setIsUpdatingPassword(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update password");
    },
  });

  const updateAvatarImageMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.patch(
        "/user/updateavatarimage",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("profile");
      toast.success("Profile image updated successfully!");
      setAvatarImage(null);
      setIsEditingAvatar(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update profile image");
    },
  });

  const updateCoverImageMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.patch(
        "/user/updatecoverimage",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("profile");
      toast.success("Cover image updated successfully!");
      setCoverImage(null);
      setIsEditingCover(false);
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update cover image");
    },
  });

  const handleUpdatePassword = () => {
    if (newPassword && oldPassword) {
      updatePasswordMutation.mutate({ oldPassword, newPassword });
    } else {
      toast.error("Both old and new passwords are required.");
    }
  };

  const handleImageUpload = (e, setImageState, maxSize = MAX_FILE_SIZE) => {
    const file = e.target.files[0];
    if (file && file.size <= maxSize && file.type.startsWith("image/")) {
      setImageState(file);
    } else {
      toast.error("Please select an image file under 2MB");
      e.target.value = "";
    }
  };

  const handleUpdateImage = (imageFile, mutation) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append(
        imageFile === avatarImage ? "avatar" : "coverImage",
        imageFile
      );
      mutation.mutate(formData);
    } else {
      toast.error("Please select an image to upload.");
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error loading profile</div>;

  return (
    <main className="p-5 bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen  ">
      <div className="mb-5 h-56">
        {profile.coverImage?.url ? (
          <div className="relative mb-5">
            <img
              src={profile.coverImage.url}
              alt="cover"
              className="w-full h-56 md:h-72 lg:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => (e.target.style.display = "none")}
            />
            <button
              className="absolute top-2 right-2 bg-orange-100 p-2 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
              onClick={() => setIsEditingCover(!isEditingCover)}
            >
              <Edit3 className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        ) : (
          <div className="bg-gray-300 h-56 md:h-72 lg:h-80 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-gray-500">No cover image available</p>
            <button
              className="  bg-orange-100 p-2 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
              onClick={() => setIsEditingCover(!isEditingCover)}
            >
              <Edit3 className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        )}
      </div>

      <section className="flex flex-col md:flex-row justify-between items-center mb-5 bg-white dark:bg-black  rounded-lg md:mt-24 lg:mt-32 shadow-md p-4">
        <div className="flex items-center gap-4 mb-5 relative">
          <img
            src={profile.avatarImage?.url}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-lg"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 ">
              {profile.channelName}
            </h2>
            <p className="text-gray-600 dark:text-gray-50">
              {profile.userName}
            </p>
          </div>
          <button
            className="absolute top-16 left-16 bg-white p-1 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
          >
            <Edit3 className="w-4 h-4 bg-orange-100 text-blue-600" />
          </button>
        </div>

        <div className="profile-info mt-5 text-gray-800 dark:text-gray-300">
          <p className="text-lg">
            <span className="font-semibold">Email: {profile.emailId}</span>
          </p>
          <p className="font-thin">
            <span className="text-base">
              Account Created:{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="font-extralight">
            <span className="text-base">
              Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
            </span>
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
        <section className="mt-5 bg-white dark:bg-black p-5 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Update Password
          </h3>
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
            {updatePasswordMutation?.isPending ? (
              <LoaderPinwheel className="animate-spin text-white" />
            ) : (
              "Update Password"
            )}
          </button>
        </section>
      )}

      {isEditingAvatar && (
        <section className="mt-5 bg-white dark:bg-black p-5 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">
            Update Profile Image
          </h3>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="w-full border mt-2"
            onChange={(e) => handleImageUpload(e, setAvatarImage)}
          />
          <button
            onClick={() =>
              handleUpdateImage(avatarImage, updateAvatarImageMutation)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
          >
            {updateAvatarImageMutation?.isPending ? (
              <LoaderPinwheel className="animate-spin text-white" />
            ) : (
              "Update Avatar"
            )}
          </button>
        </section>
      )}

      {isEditingCover && (
        <section className="mt-5 bg-white dark:bg-black p-5 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">
            Update Cover Image
          </h3>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="w-full border mt-2"
            onChange={(e) => handleImageUpload(e, setCoverImage)}
          />
          <button
            onClick={() =>
              handleUpdateImage(coverImage, updateCoverImageMutation)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
          >
            {updateCoverImageMutation?.isPending ? (
              <LoaderPinwheel className="animate-spin text-white" />
            ) : (
              "Update Cover"
            )}
          </button>
        </section>
      )}
    </main>
  );
};

export default Profile;
