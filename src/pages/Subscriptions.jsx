import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import Shimmer from "../components/Shimmer";
import Videocarrd from "../components/Videocarrd";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const {
    data: subscribedTo = [],
    isLoading: subToLoading,
    isError: subToError,
  } = useQuery({
    queryKey: ["subscribedTo"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/subscription/channels`);
      return response?.data || [];
    },
    //  refetchInterval: 35000,
    staleTime: 1000 * 60 * 5,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error fetching subscribed channels "
      );
    },
  });
  //todo:
  const {
    data: subsVideos = [],
    isLoading: subsVideosLoading,
    isError: subsVideosError,
  } = useQuery({
    queryKey: ["subsVids"],
    queryFn: async () => {
      const response = await axiosInstance.get("/subscription/subsVids");
      return response?.data || [];
    },
    // refetchInterval: 35000,
    staleTime: 1000 * 60 * 5,

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error fetching subscription videos "
      );
    },
  });

  if (subsVideosLoading || subToLoading) {
    return <Shimmer />;
  }

  if (subToError) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-red-500">
          Error something went Wrong! Please try Again later
        </p>
      </div>
    );
  }

  if (subsVideosError) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-semibold text-red-500">
          No videos from your subscriptions available yet!
        </p>
      </div>
    );
  }

  return (
    <div>
      {subscribedTo.length == 0 ? (
        <p className="text-center text-gray-500 py-5">
          You have no subscriptions yet.
        </p>
      ) : (
        <section className="flex overflow-x-auto py-5 space-x-4 scrollbar-hide">
          {Array.isArray(subscribedTo) &&
            subscribedTo?.map((sub) => (
              <Link key={sub?._id} to={`/channel/${sub?._id}`}>
                <div className="flex-shrink-0 flex flex-col items-center p-2  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={sub?.avatarImage}
                    alt="Channel Avatar"
                    className="h-14 w-14 rounded-full object-cover mb-2"
                  />
                  <p className="text-sm font-medium text-white">
                    {sub?.channelName}
                  </p>
                </div>
              </Link>
            ))}
        </section>
      )}

      {subsVideos?.videos?.length == 0 ? (
        <p className="text-center text-gray-500 py-5">
          No videos available from your subscriptions.
        </p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pt-6 bg-gray-100 dark:bg-black ">
          {subsVideos?.videos?.map((video) => (
            <Link to={`/video/${video._id}`} key={video._id}>
              {" "}
              <Videocarrd video={video} />{" "}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};

export default Subscriptions;
