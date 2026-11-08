import React, {useState} from 'react'



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlelogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'failed to login');
      }

      // jwt token browser ma save garni local storage ma!
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert ('login successfull!');
      window.location.reload();
    } catch (error) {
      setError(error.message);
    }

    setEmail('');
    setPassword('');
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
    <div className='bg-[#E9B949] p-14 rounded-4xl m-4'>
        <div className='bg-[#064c3c] p-14 rounded-4xl m-2'>
        <p className='text-amber-300 font-bold text-2xl'>Welcome back</p>
        <h1 className='text-3xl font-extralight'>Log in to your account</h1>
        <p className='text-gray-400'>Access your saved stays, trips, and member perks.</p>
        </div>

        {error && <p className=''>{error}</p>}

        <p>Email address</p>
        <input type='email' 
        value = {email}
        placeholder='you@example.com' 
        className='w-full border border-black rounded-2xl p-2 mb-4'
        onChange={(e) => setEmail(e.target.value)}/>
        <p>Password</p>
        <input type='password' 
        value = {password}
        placeholder='At least 8 characters' 
        className='w-full border border-black rounded-2xl p-2 mb-4' 
        onChange={(e) => setPassword(e.target.value)}/>
        <button
        onClick={handlelogin} 
        className='w-full bg-amber-50 border border-black rounded-2xl p-2 mt-2 hover:bg-green-600 cursor-pointer'>
          Log in
        </button>
        <p className='mt-3'>Don’t have an account? <a href='/signup' className='text-emerald-600'>Register for free</a></p>
    </div>
    </div>
  )
}

export default Login