import React from 'react'
import { CircleUserRound, Menu, MonitorPlay } from 'lucide-react'

const Navbar = ({ toggleDrawer }) => {
  return (
    <nav className=" bg-base-100 px-7 flex items-center justify-between">

   <Menu onClick={toggleDrawer} size={32} />

      

      

      <div className="flex items-center">
             <MonitorPlay />
        <p className="btn btn-ghost text-xl flex items-center">devflix</p>
      </div>

      <div className="flex items-center">
      <CircleUserRound size={32} />
      </div>
    </nav>
  )
}

export default Navbar
