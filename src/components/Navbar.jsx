import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";


const Navbar = () => {
  return (
    
    <nav className=' bg-slate-950 flex items-center py-2 px-5 justify-between text-white '>
      <div ><  RxHamburgerMenu size={33} color='white' /></div>

     <div className='flex items-center bg-slate-900 border-2 rounded-lg pr-3 p-0.5 '> <Input type="text" placeholder="search" className="bg-gray-800  border-0 border-r-2 w-96 mr-3" /> <FaSearch size={23} />  </div>

   

      <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
    </nav>
  )
}

export default Navbar
