import React, { useEffect } from 'react'
import {z} from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axiosInstance';
import toast , {Toaster} from 'react-hot-toast'
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../store/UserSlice';

const SignupSchema = z.object({
  userName: z.string().min(2, "Username must be at least 2 characters").max(20,"Username should be less than 20 characters").toLowerCase().trim(),
  channelName: z.string().min(2, "Channel name must be at least 2 characters").max(20, "Channelname should be less than 20 characters").toLowerCase().trim(),
  emailId: z.string().email("Please enter a valid email").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
    { message: "Password must contain at least one uppercase,lowercase,number,special character" }
  ),
});

const Signup = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user)
  // console.log("user" , user);

  useEffect(() => {
    if (user != null) {
      return navigate('/')
    }
  }, [])
 
  

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const mutation = useMutation({
     mutationFn: async (formData) => {
      
        const response = await axiosInstance.post('/user/signup', formData);
        return response.data;
      
        
    },
      onSuccess: (data) => {
        toast.success('Signup successful!');
        console.log('Submitted Data:', data); 
        dispatch(addUser(data))
         navigate('/')
      },
      onError: (error) => {
        console.error("err" ,error);
        toast.error(error?.response?.data?.message || 'Signup failed. Please try again.');
        
      }
    });

  const onSubmit = async (data) => {
    mutation.mutate(data); 
  };

  

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Sign Up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
           
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered"
                {...register("userName")}
              />
              {errors.userName && <p className="text-error">{errors.userName.message}</p>}
            </div>

        
            <div className="form-control">
              <label className="label">
                <span className="label-text">Channel Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your channel name"
                className="input input-bordered"
                {...register("channelName")}
              />
              {errors.channelName && <p className="text-error">{errors.channelName.message}</p>}
            </div>

          
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered"
                {...register("emailId")}
              />
              {errors.emailId && <p className="text-error">{errors.emailId.message}</p>}
            </div>

          
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered"
                {...register("password")}
              />
              {errors.password && <p className="text-error">{errors.password.message}</p>}
            </div>

           
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary " disabled={mutation.isPending}>
                {mutation.isPending ?   <Loader className="animate-spin text-white"  /> : "Signup"}   
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup
