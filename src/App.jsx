
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import './App.css'
import Container from './pages/Container'


import Signup from "./pages/Signup"

import toast, { Toaster } from 'react-hot-toast'
import Feed from './pages/Feed'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './utils/axiosInstance'

import { useDispatch } from 'react-redux'
import { addUser } from '../store/UserSlice'
import Video from './pages/Video'
import Profile from './pages/Profile'
import Channel from './pages/Channel'
import Playlist from './pages/Playlist'
import Subscriptions from './pages/Subscriptions'
import MyVideos from './pages/MyVideos'
import LogIn from './pages/LogIn'
import LikedVideos from './pages/LikedVideos'
import Feedback from './pages/Feedback'



function App() {

   const dispatch = useDispatch();


  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/auth");
        dispatch(addUser(response?.data?.data))
        return response.data;

      } catch (error) {
        console.log("auth user error" , error);
        
        if (error.response && error.response.status === 401) {
          return null
        }
        toast.error(error?.response?.data?.message || "Something went wrong")
      }
    }
  });

  if (isLoading) {
    return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
             <p className="text-lg font-semibold text-gray-700 mb-4 px-2 text-center">
             "⏳The server is waking up! Just a moment; your awesome content is on its way, and we can't wait for you to see it!"
             </p>
    
  </div>
    )
  };
  


  return (
    <>
    
    
      <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Container/>}>
        <Route path='/' element={authUser ? <Feed/> : <Navigate to={"/login"} /> } />
          <Route path='/login' element={ !authUser ? <LogIn/> : <Navigate to={'/'} /> }/>
          <Route path='/signup' element={ !authUser ? <Signup/> : <Navigate to={'/'} /> }/>
          <Route path='/video/:videoId' element= {authUser ? <Video/> : <Navigate to={'/'}/> } />
          <Route path='/profile' element= {authUser ? <Profile/> : <Navigate to={'/'}/> } />
          <Route path='/channel/:channelId' element= {authUser ? <Channel/> : <Navigate to={'/'}/> } />
          <Route path='/playlist/:playlistId' element= {authUser ? <Playlist/> : <Navigate to={'/'}/> } />
          <Route path='/playlist/:playlistId/video/:videoId' element= {authUser ? <Video/> : <Navigate to={'/'}/> } />
          <Route path='/subscriptions' element= {authUser ? <Subscriptions/> : <Navigate to={'/'}/> } />
          <Route path='/managevideos' element= {authUser ? <MyVideos/> : <Navigate to={'/'}/> } />
          <Route path='/likedvideos' element= {authUser ? <LikedVideos/> : <Navigate to={'/'}/> } />
          <Route path='/feedback' element= {authUser ? <Feedback/> : <Navigate to={'/'}/> } />
          
        </Route>
      </Routes>  
      <Toaster />    
      </BrowserRouter>
    </>
  )
}

export default App
