import React from 'react'
import { FaHome , FaVideo } from "react-icons/fa";
import { MdSubscriptions , MdOutlinePlaylistPlay } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
const Sidebar = () => {

  const menuClasses = 'flex px-8 py-2 m-2';

  return (
    <aside className='bg-slate-900 text-white w-2/12 rounded-sm'>

      <section className='border-y-2 border-gray-400  '>
        <div className= {menuClasses} > <FaHome  size={25} /> <span className='pl-7' >Home</span></div>
        <div className= {menuClasses}  > <MdSubscriptions size={25} /> <span className='pl-7' >Subscription</span></div>
      </section>

      <section className='border-b-2 border-gray-400'>
        <div className={menuClasses}  > <GrChannel size={25} /> <span className='pl-7' >Your Channel</span></div>
        <div className= {menuClasses}  > <FaVideo size={25} /> <span className='pl-7' >Liked videos</span></div>
        <div className= {menuClasses}  > <MdOutlinePlaylistPlay size={25} /> <span className='pl-7' >Playlists</span></div>
      </section> 



    </aside>
  )
}

export default Sidebar
