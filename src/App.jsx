
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import './App.css'
import Container from './pages/Container'
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import toast, { Toaster } from 'react-hot-toast'
import Feed from './pages/Feed'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './utils.js/axiosInstance'
import Shimmer from './components/Shimmer'



function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/user/auth");
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null
        }
        toast.error(error?.response?.data?.message || "Something went wrong")
      }
    }
  });

  if (isLoading) return <Shimmer/>
  


  return (
    <>
      <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Container/>}>
        <Route path='/' element={authUser ? <Feed/> : <Navigate to={"/login"} /> } />
          <Route path='/login' element={ !authUser ? <Login/> : <Navigate to={'/'} /> }/>
          <Route path='/signup' element={ !authUser ? <Signup/> : <Navigate to={'/'} /> }/>
          
        </Route>
      </Routes>  
      <Toaster />    
      </BrowserRouter>
    </>
  )
}

export default App
