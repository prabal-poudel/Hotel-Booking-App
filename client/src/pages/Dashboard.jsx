// import React, { useState } from 'react'
// import Hotelregistrationform from '../components/Hotelregistrationform'
// import { useEffect } from 'react';

// const Dashboard = () => {
//   const [isModelopen, setIsmodelopen] = useState(false);
//   const [properties, setProperties] = useState([]);
//   const [activeview, setActiveview] = useState('overview');

//   return (
//     <div className='flex gap-10'>
//       <div className='min-h-screen flex flex-col p-8 gap-10 bg-amber-300 '>
//         <a href='/'>Properties</a>
//         <a href='/'>Bookings</a>
//         <a href='/'>Overview</a>
//       </div>
//       <div className=''>
//         This is the actual content.
//         <button onClick={() => setIsmodelopen(true)} className='p-3 rounded-2xl font-bold text-amber-50 bg-[#004F3B] cursor-pointer'>+ Add property</button>
//         {/* modal overlay with blue effects */}
//         {isModelopen && (
//           <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto p-4'>
//             <Hotelregistrationform onClose={() => setIsmodelopen(false)} />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Dashboard


import React, { useState, useEffect } from 'react'
import Hotelregistrationform from '../components/Hotelregistrationform'
import dotenv from "dotenv";

const API = 'process.env.api'

const Dashboard = () => {
  const [isModelopen, setIsmodelopen] = useState(false)
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeview, setActiveview] = useState('overview')

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }

  const loadProperties = () => {
    fetch(`${API}/api/properties/mine`, { headers: authHeader })
      .then(res => res.json())
      .then(data => Array.isArray(data) && setProperties(data))
      .catch(console.error)
  }

  const loadBookings = () => {
    fetch(`${API}/api/bookings/owner`, { headers: authHeader })
      .then(res => res.json())
      .then(data => Array.isArray(data) && setBookings(data))
      .catch(console.error)
  }

  // 
  const handleDeleteBooking = async (bookingId) => {
  if (!window.confirm('Delete this booking? The guest will lose it from My Trips too.')) return

  try {
    const res = await fetch(`${API}/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: authHeader,
    })
    const data = await res.json()

    if (res.ok) {
      setBookings(bookings.filter(b => b._id !== bookingId))
    } else {
      alert(data.message)
    }
  } catch (err) {
    console.error(err)
    alert('Something went wrong')
  }
}

  // load both when the dashboard opens
  useEffect(() => {
    loadProperties()
    loadBookings()
  }, [])

  const totalEarnings = bookings.reduce((sum, b) => sum + b.totalPrice, 0)

  const menuClass = (name) =>
    `text-left font-semibold cursor-pointer ${activeview === name ? 'underline' : ''}`

  return (
    <div className='flex gap-10'>
      {/* SIDE MENU */}
      <div className='min-h-screen flex flex-col p-8 gap-10 bg-amber-300'>
        <button className={menuClass('overview')} onClick={() => setActiveview('overview')}>Overview</button>
        <button className={menuClass('properties')} onClick={() => setActiveview('properties')}>Properties</button>
        <button className={menuClass('bookings')} onClick={() => setActiveview('bookings')}>Bookings</button>
      </div>

      {/* CONTENT */}
      <div className='flex-1 p-6'>

        {/* OVERVIEW */}
        {activeview === 'overview' && (
          <div>
            <h1 className='text-3xl font-bold mb-6'>Overview</h1>
            <div className='flex gap-6 flex-wrap'>
              <div className='p-6 rounded-2xl shadow border w-56'>
                <p className='text-gray-600'>Total properties</p>
                <p className='text-3xl font-bold'>{properties.length}</p>
              </div>
              <div className='p-6 rounded-2xl shadow border w-56'>
                <p className='text-gray-600'>Total bookings</p>
                <p className='text-3xl font-bold'>{bookings.length}</p>
              </div>
              <div className='p-6 rounded-2xl shadow border w-56'>
                <p className='text-gray-600'>Total earnings</p>
                <p className='text-3xl font-bold'>NPR {totalEarnings}</p>
              </div>
            </div>
          </div>
        )}

        {/* PROPERTIES */}
        {activeview === 'properties' && (
          <div>
            <div className='flex justify-between items-center mb-6'>
              <h1 className='text-3xl font-bold'>My Properties ({properties.length})</h1>
              <button
                onClick={() => setIsmodelopen(true)}
                className='p-3 rounded-2xl font-bold text-amber-50 bg-[#004F3B] cursor-pointer'
              >
                + Add property
              </button>
            </div>

            {properties.length === 0 && <p>You have not added any property yet.</p>}

            <div className='grid gap-6 md:grid-cols-3'>
              {properties.map(p => (
                <div key={p._id} className='border rounded-2xl p-4 shadow'>
                  {p.photos?.[0] && (
                    <img
                      src={`${API}/${p.photos[0].replace(/\\/g, '/')}`}
                      alt={p.name}
                      className='w-full h-40 object-cover rounded-xl'
                    />
                  )}
                  <h2 className='text-xl font-bold mt-2'>{p.name}</h2>
                  <p className='text-gray-600'>{p.location}</p>
                  <p className='font-semibold'>NPR {p.price} / night</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeview === 'bookings' && (
          <div>
            <h1 className='text-3xl font-bold mb-6'>Customer Bookings ({bookings.length})</h1>

            {bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-left border'>
                  <thead className='bg-amber-100'>
                    <tr>
                      <th className='p-2'>Guest</th>
                      <th className='p-2'>Email</th>
                      <th className='p-2'>Property</th>
                      <th className='p-2'>Check-in</th>
                      <th className='p-2'>Check-out</th>
                      <th className='p-2'>Nights</th>
                      <th className='p-2'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} className='border-t'>
                        <td className='p-2'>{b.user?.fullname}</td>
                        <td className='p-2'>{b.user?.email}</td>
                        <td className='p-2'>{b.property?.name}</td>
                        <td className='p-2'>{new Date(b.checkIn).toLocaleDateString()}</td>
                        <td className='p-2'>{new Date(b.checkOut).toLocaleDateString()}</td>
                        <td className='p-2'>{b.nights}</td>
                        <td className='p-2'>NPR {b.totalPrice}</td>
                        <td className='p-2'>
                          {/* new button to delete */}
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className='bg-red-600 text-white px-3 py-1 rounded-xl font-semibold hover:bg-red-700 cursor-pointer'
                        >
                          Delete
                        </button>
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD PROPERTY MODAL */}
        {isModelopen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto p-4'>
            <Hotelregistrationform
              onClose={() => {
                setIsmodelopen(false)
                loadProperties()      // refresh the list after adding
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard