import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({hotel}) => {
  return (
    <div className='w-100 h-100 flex justify-center items-center flex-col text-center p-4  m-10 shadow-xl rounded-4xl border-black '>
        <img src={hotel.img}
        alt={hotel.imgname}
        className='w-100 h-100 object-cover object-center' />
        <div>
            <h2 className='font-bold text-2xl'>{hotel.name}</h2>
            <p>{hotel.description}</p>
            <div className='flex text-2xl justify-between items-center m-2 '>
            <p className='text-black font-bold'>{hotel.price}</p>
            <Link to={hotel.link || `/hotels/${hotel._id || hotel.id}`} 
            className='text-green-600 font-bold text-2xl
            state={{ hotel }}
            '>View Stay</Link>
            </div>
        </div>
    </div>
  )
}

export default HotelCard