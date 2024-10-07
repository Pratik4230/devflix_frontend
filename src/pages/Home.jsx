import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Home = () => {

    const a = true

  return (
    <div>
        <Navbar/>

        <main className='flex'>
       {/* <Sidebar/>  */}
        <Outlet/>
        </main>
      
     

     
    </div>
  )
}

export default Home
