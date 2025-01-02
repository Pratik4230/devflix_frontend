import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { LoaderPinwheel } from "lucide-react";

const Feedback = () => {
  const username = useSelector((state) => state?.user?.user?.userName);
  const [feedback, setFeedBack] = useState("");
  const feedbackMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/feedback/message", data);
      return response;
    },
    onSuccess: (data) => {
      toast.success("Feedback send successfully!");
      setFeedBack("");
    },
    onError: (error) => {
      toast.error(error?.response?.data || "something went wrong");
    },
  });

  const handleSubmit = () => {
    if (username) {
      feedbackMutation.mutate({ content: feedback, username });
    }
  };

  return (
    <main className=" flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Feedback
          </h1>
        </div>
        <p className="text-gray-950 font-semibold  dark:text-gray-400 mb-4">
          Feel free to give feedback or suggestions!
        </p>
        <section className="mb-4">
          <input
            type="text"
            value={username || ""}
            disabled
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none"
            placeholder="Username not available"
          />
        </section>

        <section className="mb-6">
          <textarea
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedBack(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full h-32 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          ></textarea>
        </section>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {feedbackMutation.isPending ? (
            <LoaderPinwheel className="animate-spin " size={25} />
          ) : (
            "Submit "
          )}
        </button>
      </div>
    </main>
  );
};

export default Feedback;
