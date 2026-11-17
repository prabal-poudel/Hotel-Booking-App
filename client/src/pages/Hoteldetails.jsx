import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000'

const HotelDetails = () => {
  const { id } = useParams()          
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [error, setError] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const today = new Date().toISOString().split('T')[0]

  // ask the backend for this hotel
  useEffect(() => {
    fetch(`${API}/api/properties/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Hotel not found')
        return res.json()
      })
      .then(data => setHotel(data))
      .catch(err => setError(err.message))
  }, [id])

  if (error) return <p className='p-10'>{error}</p>
  if (!hotel) return <p className='p-10'>Loading...</p>

  // fix the backslash in the image path
  const image = hotel.photos?.[0]
    ? `${API}/${hotel.photos[0].replace(/\\/g, '/')}`
    : ''

  // calculate nights and total
  let nights = 0
  if (checkIn && checkOut) {
    nights = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  }
  const total = nights > 0 ? nights * hotel.price : 0

  const handleBook = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please log in first')
      return navigate('/login')
    }
    if (nights <= 0) {
      return alert('Please select valid check in and check out dates.')
    }

  try {
    const res = await fetch(`${API}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ propertyId: id, checkIn, checkOut }),
    })

    const data = await res.json()

    if (res.ok) {
      alert('Booking confirmed!')
      navigate('/mytrips')
    } else {
      alert(data.message)
    }
  } catch (err) {
    console.error(err)
    alert('Something went wrong')
  }
}

  return (
    <div className='max-w-3xl mx-auto p-6'>
      {image && (
        <img src={image} alt={hotel.name} className='w-full h-80 object-cover rounded-3xl' />
      )}
      <h1 className='text-3xl font-bold mt-4'>{hotel.name}</h1>
      <p className='text-gray-600'>{hotel.location}</p>
      <p className='text-xl font-semibold mt-2'>NPR {hotel.price} / night</p>

      <div className='flex gap-4 mt-6'>
        <div>
          <label className='block font-medium'>Check-in</label>
          <input
            type='date'
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className='border rounded-xl p-2'
          />
        </div>

        <div>
          <label className='block font-medium'>Check-out</label>
          <input
            type='date'
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className='border rounded-xl p-2'
          />
        </div>
      </div>

      {nights > 0 && (
        <div className='mt-4 p-4 bg-amber-50 rounded-2xl border'>
          <p>{nights} night(s) x NPR {hotel.price}</p>
          <p className='text-2xl font-bold'>Total: NPR {total}</p>
        </div>
      )}

      <button onClick={handleBook} className='mt-6 w-full bg-[#064c3c] text-amber-300 rounded-2xl p-3 font-bold cursor-pointer'>
        Book now
      </button>
    </div>
  )
}

export default HotelDetails