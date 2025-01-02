import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const SignupSchema = z.object({
  userName: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username should be less than 20 characters")
    .toLowerCase()
    .trim(),
  channelName: z
    .string()
    .min(2, "Channel name must be at least 2 characters")
    .max(20, "Channelname should be less than 20 characters")
    .toLowerCase()
    .trim(),
  emailId: z.string().email("Please enter a valid email").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
      {
        message:
          "Password must contain at least one uppercase,lowercase,number,special character",
      }
    ),
});

const Signup = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/user/signup", formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Signup successful!");

      queryClient.invalidateQueries(["authUser"]);

      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again ."
      );
      console.log("signup err", error);
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100 dark:bg-black">
      <div className="card w-96 bg-orange-50 dark:bg-gray-950 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl text-blue-500 font-semibold mb-6 text-center">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="  text-gray-900 dark:text-green-50  font-semibold ">
                  Username
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered text-yellow-50"
                {...register("userName")}
              />
              {errors.userName && (
                <p className="text-error">{errors.userName.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="block text-gray-900 dark:text-green-50  font-semibold">
                  Channel Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter your channel name"
                className="input input-bordered text-yellow-50"
                {...register("channelName")}
              />
              {errors.channelName && (
                <p className="text-error">{errors.channelName.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="block text-gray-900 dark:text-green-50  font-semibold">
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered text-yellow-50"
                {...register("emailId")}
              />
              {errors.emailId && (
                <p className="text-error">{errors.emailId.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="block text-gray-900 dark:text-green-50  font-semibold">
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered text-yellow-50"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-error">{errors.password.message}</p>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn text-lg text-orange-100 btn-primary "
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader className="animate-spin text-white" />
                ) : (
                  "Signup"
                )}
              </button>
            </div>
            <p className="mt-6 text-lg flex text-slate-900 dark:text-sky-50 justify-center">
              Have an account?{" "}
              <Link to={"/login"}>
                {" "}
                <span className="text-blue-600"> &nbsp; Log in </span>{" "}
              </Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
