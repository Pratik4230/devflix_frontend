import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {buttonVariants} from "@/components/ui/button"
import {Link} from "react-router-dom"

import './App.css'

function App() {
  

  return (
    <>
      <div>
        <button className='bg-blue-500 p-5 m-5 text-white rounded-lg'>Click me</button>
        <Button variant="destructive" >Click me</Button>

    


        <Link to={"/google"} className={buttonVariants({ variant: "outline" })}>Click here</Link>



      </div>
    </>
  )
}

export default App

