import { validationResult } from 'express-validator';
import React, {useState} from 'react'
import { Slide } from 'react-toastify';
 
const Signup = () => {
    // sate to hold user input 
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [role, setRole] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('https://hotel-booking-app-x553.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({fullname, email, password, role,}),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "something went wrong");
            }
            setSuccess("Account made you can log in now.")
            // clerning the inputs 
            setFullname('');
            setEmail('');
            setPassword('');

        } catch (err) {
            setError(err.message);
        }
    };

  return (
    <div>
    <div className='flex justify-center items-center min-h-screen'>
    <div className='bg-[#E9B949] p-14 rounded-4xl m-4'>
        <div className='bg-[#064c3c] p-14 rounded-4xl m-2'>
        <p className='text-amber-300 font-bold text-2xl'>Join Us!</p>
        <h1 className='text-3xl font-extralight'>Create your account</h1>
        <p className='text-gray-400'>Save inspiring stays and make every trip easier.</p>
        </div>

        {/* error or success msg */}
        {error && <p className='text-red-600 w-full flex justify-center m-2 text-2xl font-bold'>{error}</p>}
        {success && <p className='text-green-600 w-full flex justify-center m-2 text-2xl font-bold'>{success}</p>}

        <p>Full name</p>
        <input type='text' 
        value={fullname}
        placeholder='Your full name' 
        className='w-full border border-black rounded-2xl p-2 mb-4'
            onChange={(e) => setFullname(e.target.value)}/>
        <p>Email address</p>
        <input type='email' 
        value={email}
        placeholder='you@example.com' 
        className='w-full border border-black rounded-2xl p-2 mb-4'
            onChange={(e) => setEmail(e.target.value)}/>
        <p>Password</p>
        <input type='password' 
        value={password}
        placeholder='At least 8 characters' 
        className='w-full border border-black rounded-2xl p-2 mb-4'
            onChange={(e) => setPassword(e.target.value)} />
            <p>Select a role as a client or a hotel owner.</p>
            <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className='w-full border border-gray-700 rounded-2xl px-2 py-2 text-black'
            >
            <option value="client">Client</option>
            <option value="owner">Hotel Owner</option>
            </select>
        <button onClick={handleSignup} className='w-full bg-amber-50 border border-black rounded-2xl p-2 mt-2 hover:bg-green-600 cursor-pointer'>Create account</button>
        <p className='mt-3'>Already have an account? <a href='/login' className='text-emerald-600'>Log in</a></p>
    </div>
    </div>
    </div>
  )
}

export default Signup