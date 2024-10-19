import React from 'react'
import { CircleUserRound, Menu, MonitorPlay } from 'lucide-react'
import { useSelector } from 'react-redux'

const Navbar = ({ toggleDrawer }) => {

  const user = useSelector((state) => state.user.user)
  const Avtar = user?.data?.avatarImage?.url;

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
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div> 
    </nav>
  )
}
// 
export default Navbar
