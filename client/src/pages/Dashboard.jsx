import React, { useState } from 'react'
import Hotelregistrationform from '../components/Hotelregistrationform'
import { useEffect } from 'react';

const Dashboard = () => {
  const [isModelopen, setIsmodelopen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [activeview, setActiveview] = useState('overview');

  return (
    <div className='flex gap-10'>
      <div className='min-h-screen flex flex-col p-8 gap-10 bg-amber-300 '>
        <a href='/'>Properties</a>
        <a href='/'>Bookings</a>
        <a href='/'>Overview</a>
      </div>
      <div className=''>
        This is the actual content.
        <button onClick={() => setIsmodelopen(true)} className='p-3 rounded-2xl font-bold text-amber-50 bg-[#004F3B] cursor-pointer'>+ Add property</button>
        {/* modal overlay with blue effects */}
        {isModelopen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto p-4'>
            <Hotelregistrationform onClose={() => setIsmodelopen(false)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard