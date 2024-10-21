import React from 'react'
import { CircleUserRound, Menu, MonitorPlay } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../utils.js/axiosInstance'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { removeUser } from '../../store/UserSlice'


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
          toast.success("logout successful")
          dispatch(removeUser())
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            navigate('/' , {replace: true})
           },
           onError: (error) => {
            toast.error(error?.response?.data?.message)
            console.error('err' , error);
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
        <p className="btn btn-ghost text-xl flex items-center">devflix</p>
      </div>

      <div className="flex items-center dropdown dropdown-end">
        {user ? <img src={Avtar} alt="Profile" tabIndex={0} role="button" className='h-9 w-9 rounded-full ' /> : <CircleUserRound size={32} />}
        <ul
          tabIndex={0}
          className="menu top-10 bg-white dropdown-content  rounded-box z-[1] mt-4 w-52 p-2 shadow">
          <li><a>Profile</a></li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div> 
    </nav>
  )
}
// 
export default Navbar
