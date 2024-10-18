
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Container from './pages/Container'
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import { Toaster } from 'react-hot-toast'
import Feed from './pages/Feed'



function App() {
  


  return (
    <>
      <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Container/>}>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element= {<Signup/>}/>
          <Route path='/feed' element= {<Feed/>}/>
        </Route>
      </Routes>  
      <Toaster />    
      </BrowserRouter>
    </>
  )
}

export default App
