
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Feed from './pages/Feed'

function App() {
  

  return (
    <BrowserRouter basename='/'>
      <Routes>
          <Route path='/' element={<Home/>}>
            <Route path='auth' element={<Auth/>}/>
            <Route path='feed' element={<Feed/>}/>
            
          
          
          </Route>
      </Routes>   
        
        
    </BrowserRouter>
  )
}

export default App

