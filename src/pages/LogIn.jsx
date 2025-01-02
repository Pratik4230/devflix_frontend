import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useState } from "react";

const LoginSchema = z.object({
  emailId: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
});

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/user/login", data);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Login successfully");

      queryClient.invalidateQueries(["authUser"]);

      navigate("/", { replace: true });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error("login err", error);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleGuestLogin = () => {
    const guestCredentials = {
      emailId: "random@gmail.com",
      password: "Random@123",
    };
    mutation.mutate(guestCredentials);
  };

  return (
    <div className="flex  justify-center items-center h-screen bg-blue-100 dark:bg-black min-w-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-orange-50 p-6 rounded-lg shadow-lg w-full dark:bg-gray-950 max-w-sm border-2 border-red-100 "
      >
        <h2 className="text-3xl text-blue-500 font-semibold mb-6 text-center">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-900 dark:text-green-50 text-sm font-bold mb-2">
            Email ID
          </label>
          <input
            type="email"
            {...register("emailId")}
            className={`input input-bordered  text-yellow-50 w-full ${
              errors.emailId ? "border-red-500" : ""
            }`}
            placeholder="Enter your email"
          />
          {errors.emailId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.emailId.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-900 dark:text-green-50 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className={`input input-bordered text-yellow-50 w-full ${
              errors.password ? "border-red-500" : ""
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary text-white text-lg w-full mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader className="animate-spin text-white" />
          ) : (
            "LogIn"
          )}
        </button>

        <button
          onClick={handleGuestLogin}
          className="btn  text-white text-lg w-full mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader className="animate-spin text-white" />
          ) : (
            " LogIn as Guest !!!"
          )}
        </button>

        <p className="mt-6 text-lg text-slate-900 dark:text-orange-50 flex justify-center">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            {" "}
            <span className="text-blue-600 "> &nbsp; Sign Up now</span>{" "}
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default LogIn;
