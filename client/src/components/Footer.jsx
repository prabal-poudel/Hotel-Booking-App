import React from 'react'

const Footer = () => {
  return (
    <div className='flex justify-center p-7 shadow-lg'>
        <p>© 2025 QuickyStay. Made for memorable stays.</p>
        <div className='absolute right-7 flex gap-5'>
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Help</a>
        </div>
    </div>
  )
}

export default Footer