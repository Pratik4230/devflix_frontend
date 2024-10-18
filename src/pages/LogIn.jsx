import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema with the correct regex
const LoginSchema = z.object({
  emailId: z
    .string()
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle login logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200 min-w-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email ID
          </label>
          <input
            type="email"
            {...register("emailId")}
            className={`input input-bordered w-full ${
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

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className={`input input-bordered w-full ${
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

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
