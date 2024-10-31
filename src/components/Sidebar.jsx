import React from 'react'
import { Heart,  House,Video , TvMinimalPlay, Youtube ,MessageCircleDashed } from 'lucide-react'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = ({ isDrawerOpen, toggleDrawer }) => {
  
  const MenuClasses = 'flex items-center py-5  pl-2 border-b-2'
  const MenuTag = ' ml-7 text-xl font-semibold '

 const user = useSelector((store) => store?.user?.user);



  const handleClose = () => {
    toggleDrawer(false)
  }

  

  return  (
<>
    {isDrawerOpen &&   (
      <aside onClick={handleClose} className='bg-base-300 w-9/12 lg:w-[20%] px-3 pl-7 py-3 pb-10 rounded-lg '>
     <Link to={'/'} >  <div  className={MenuClasses}> <House size={32} />  <p className={MenuTag} >Home</p> </div> </Link> 
   <Link to={'/subscriptions'} >   <div className={MenuClasses}> <Youtube size={32} /> <p className={MenuTag}>Subscriptions </p> </div> </Link> 
       <Link to={`/channel/${user?._id}`} >  <div className={MenuClasses}> <TvMinimalPlay size={32} />   <p className={MenuTag}> Your Channel</p>   </div> </Link>
       <Link to={'/likedvideos'} >   <div className={MenuClasses}> <Heart size={32} /> <p className={MenuTag}>Liked Videos </p> </div> </Link>
       
    <Link to={'/managevideos'} >   <div className={MenuClasses}> <Video  size={32} /> <p className={MenuTag}>Manage Videos</p>  </div>  </Link>
    <Link to={'/feedback'} >   <div className={MenuClasses}> <MessageCircleDashed  size={32} /> <p className={MenuTag}>Feedback</p>  </div>  </Link>
       </aside> 
    ) }
    
    </>
    
  ) 
}

export default Sidebar
