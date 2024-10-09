import React from 'react'
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
const Searchbar = () => {
  return (
    <div className='flex items-center bg-slate-900 border-2 rounded-lg pr-3 p-0.5  '> <Input type="text" placeholder="search" className="bg-gray-800  border-0 border-r-2 w-96 mr-3" /> <FaSearch size={23} className="text-red-500 lg:text-blue-500"/>  </div>
    
  )
}

export default Searchbar
