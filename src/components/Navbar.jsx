import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Searchbar from './Searchbar';
import Hamburger from './Hamburger';
import { ModeToggle } from '../components/mode-toggle'


const Navbar = () => {
  return (
    
    <nav className=' bg-slate-950 flex items-center py-2 px-5 justify-between text-white '>
     
     <div className='invisible lg:visible' > <Hamburger/></div>

      <div className='invisible lg:visible '>  <Searchbar/>  </div>
  
      <p className='text-black dark:text-white'><ModeToggle/> </p>

      <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
    </nav>
  )
}

export default Navbar
