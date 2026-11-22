import React, { useEffect, useState } from 'react'

const API = 'https://hotel-booking-app-x553.onrender.com/'

const Mytrips = () => {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    fetch(`${API}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) && setTrips(data))
      .catch(console.error)
  }, [])

  const handleDelete = async (bookingId) => {
  if (!window.confirm('Are you sure you want to cancel this booking?')) return

  try {
    const res = await fetch(`${API}/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    const data = await res.json()

    if (res.ok) {
      // remove it from the screen without refreshing
      setTrips(trips.filter(t => t._id !== bookingId))
    } else {
      alert(data.message)
    }
  } catch (err) {
    console.error(err)
    alert('Something went wrong')
  }
}

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>My Trips</h1>

      {trips.length === 0 && <p>No trips yet.</p>}

      {trips.map(t => (
        <div key={t._id} className='flex gap-4 border rounded-2xl p-4 mb-4 shadow'>
          {t.property?.photos?.[0] && (
            <img
              src={`${API}/${t.property.photos[0].replace(/\\/g, '/')}`}
              alt=''
              className='w-40 h-28 object-cover rounded-xl'
            />
          )}
          <div>
            <h2 className='text-xl font-bold'>{t.property?.name}</h2>
            <p>{t.property?.location}</p>
            <p>
              {new Date(t.checkIn).toLocaleDateString()} to {new Date(t.checkOut).toLocaleDateString()}
            </p>
            <p>{t.nights} night(s) · <b>NPR {t.totalPrice}</b></p>
            <button onClick={() => handleDelete(t._id)} className='mt-3 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 cursor-pointer'>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Mytrips