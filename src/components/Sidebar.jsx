import React from 'react'
import { Heart, History, House, ListVideo, TvMinimalPlay, Youtube } from 'lucide-react'
import {Link} from 'react-router-dom'

const Sidebar = ({ isDrawerOpen, toggleDrawer }) => {
  
  const MenuClasses = 'flex items-center py-5  pl-2 border-b-2'
  const MenuTag = ' ml-7 text-xl font-semibold '


  const handleClose = () => {
    toggleDrawer(false)
  }

  

  return  (
<>
    {isDrawerOpen &&   (
      <aside onClick={handleClose} className='bg-base-300 w-9/12 lg:w-[20%] px-3 pl-7 py-3 pb-10 rounded-lg '>
       <div  className={MenuClasses}> <House size={32} />  <Link to={'/'} className={MenuTag}>Home</Link> </div>
       <div className={MenuClasses}> <Youtube size={32} /> <p className={MenuTag}>Subscriptions </p> </div>
       <div className={MenuClasses}> <TvMinimalPlay size={32} /> <Link to={'/channel'} className={MenuTag}>Your Channel</Link>  </div>
        <div className={MenuClasses}> <ListVideo size={32} /> <p className={MenuTag}>Playlist</p>  </div>
       <div className={MenuClasses}> <Heart size={32} /> <p className={MenuTag}>Liked Videos </p> </div>
       <div className={MenuClasses}> <History size={32} /> <p className={MenuTag}>Watch History</p>  </div> 
       </aside> 
    ) }
    
    </>
    
  ) 
}

export default Sidebar
