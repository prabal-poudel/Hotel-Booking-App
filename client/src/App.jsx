import React from 'react'
import Navbar from './components/Navbar'
import { Route, useLocation, BrowserRouter, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Searchhotel from './pages/Searchhotels'
import Mytrips from './pages/Mytrips'
import Dashboard from './pages/Dashboard'

const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div className='flex min-h-screen flex-col'>
      {!isOwnerPath && <Navbar/>}
      <div className='flex-1 pt-24'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/hotelsearch' element={<Searchhotel />}/>
          <Route path='/mytrips' element={<Mytrips />} />
          <Route path='/dashboard' element={<Dashboard />}/>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App