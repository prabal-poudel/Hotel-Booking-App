import React from 'react'
import Navbar from './components/Navbar'
import { Route, useLocation, BrowserRouter, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Searchhotels from './pages/Searchhotels'

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar/>}
      <div className='min-h-[70vh] pt-24'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/searchhotels' element={<Searchhotels />}/>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App