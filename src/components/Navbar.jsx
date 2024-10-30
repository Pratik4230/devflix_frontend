import React, { useState } from 'react'
import { CircleUserRound, Menu, MonitorPlay } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../utils/axiosInstance'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { removeUser } from '../../store/UserSlice'
import ThemeToggle from './ThemeToggle'


const Navbar = ({ toggleDrawer }) => {

  const user = useSelector((state) => state.user.user)  
  const Avtar = user?.avatarImage?.url;

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const queryClient = useQueryClient();

  
      const Logout = useMutation({
        mutationFn: async () => {
          return await axiosInstance.post('/user/logout', {});
        },
        onSuccess: (data) => {
          toast.success(data?.message ||"logout successful")
          dispatch(removeUser())
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            navigate('/' , {replace: true})          
           },
           onError: (error) => {
            toast.error(error?.response?.data?.message)
            console.error('logout err' , error);
          }
          
      })

      const handleLogout = () => {
        Logout.mutate();
      }


  return (
    <nav className=" bg-base-100 px-7 flex items-center justify-between">

   <Menu onClick={toggleDrawer} size={32} />


      <div className="flex items-center">
             <MonitorPlay />
        <Link to={'/'} className="btn btn-ghost text-xl flex items-center">devflix</Link>
      </div>

<section className='flex gap-4 items-center'>

<ThemeToggle />
      <div className="flex items-center dropdown dropdown-end">
      
        {user ? <img src={Avtar} alt="Profile" tabIndex={0} role="button" className='h-9 w-9 rounded-full ' /> : <CircleUserRound size={32} />}
        <ul
          tabIndex={0}
          className="menu top-10  dropdown-content   z-[1] mt-4 w-52 p-2  shadow    ">
          <Link to={'/profile'} className=' bg-slate-950 text-lg flex justify-center items-center cursor-pointer rounded-xl h-12 border-b-2  text-white'><p>Profile</p></Link>
          <li onClick={handleLogout} className=' bg-slate-900 text-lg flex justify-center items-center cursor-pointer rounded-xl text-white h-12 w-full border-b-2'>Logout</li>
        </ul>
      </div> 

      </section>


    </nav>
  )
}
 
export default Navbar
