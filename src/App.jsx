
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
  

  return (
    <BrowserRouter basename='/'>
      <Routes>
          <Route path='/' element={<Home/>}>
            <Route path='auth' element={<Auth/>}/>
            
          
          
          </Route>
      </Routes>   
        
        
    </BrowserRouter>
  )
}

export default App

