import React, { useState } from 'react'
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar" 
import { Outlet } from 'react-router-dom'

const Container = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }
  return (
    <>
        <Navbar toggleDrawer={toggleDrawer} />

<div className='fixed w-screen z-10'> <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} /> </div>
        
        <Outlet/>
        
          
    </>
  )
}

export default Container
