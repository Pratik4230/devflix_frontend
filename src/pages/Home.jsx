import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Mainbody from './Feed'
const Home = () => {

    const a = true

  return (
    <div>
        <Navbar/>

        <main className='flex'>
         
       <Sidebar/> 
        
        <Outlet/>
        </main>
      
     

     
    </div>
  )
}

export default Home
