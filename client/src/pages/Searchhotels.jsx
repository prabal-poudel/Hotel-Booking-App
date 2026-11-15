import React from 'react'
import PropertyList from '../components/PropertyList'

const Searchhotel = () => {
  return (
    <div>
    <div className='bg-[#002C22] p-4 rounded-2xl mx-9 my-6 py-9 text-amber-50 '>
        <div className='flex gap-75'>
          <div className='p-4'>
            <p className='text-amber-300 text-2xl '>Find your next stay</p>
            <h2 className='text-6xl font-semibold'>Search hotels</h2>
            <p className='text-mauve-500 text-2xl'>Compare handpicked stays and find the one that feels right.</p>
          </div>
          <div>
            <input 
            type='text'
            placeholder='Search by hotel or destination'
            className='rounded-4xl bg-amber-50 placeholder-black p-4 text-2 px-16' />
          </div>
        </div>
    </div>
    {/* component from backend */}
    <PropertyList />
    </div>
  )
}

export default Searchhotel