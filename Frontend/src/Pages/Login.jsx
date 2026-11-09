import React, { useState } from 'react'
import { GiReturnArrow } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { appfirstname, applastname, backendurl } from '../config'
import { ArrowLeft } from 'lucide-react'
axios.defaults.withCredentials = true

export default function Login () {
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')

  const [rememberMe, setRememberMe] = useState(false)
  const [Loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()
    if (Loading) return
    setLoading(true)

    if (!Email) return toast.error('Email required')
    if (!Password) return toast.error('Password required')

    try {
      const request = await axios.post(`${backendurl}/auth/login`, {
        Email,
        Password
      })

      if (request.data.success) {
        navigate('/')
        setLoading(false)

        setPassword('')
        setEmail('')
      }
    } catch (error) {
      console.log(error)
      setLoading(false)

      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      {/* Decorative background glow */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-tr from-red-600/5 via-red-600/5 to-transparent blur-3xl pointer-events-none -z-10' />

      <p
        onClick={() => navigate('/')}
        className=' absolute top-5 left-5 cursor-pointer  inline-flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium mb-9 transition'
      >
        <ArrowLeft size={17} />
        Back to Home
      </p>
      {/* Header / Brand Logo */}
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center items-center gap-2 mb-3'>
          <div className='h-10 w-10 rounded-xl bg-linear-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-md shadow-red-500/20'>
            <GiReturnArrow className='w-6 h-6 text-white' />
          </div>
          <p className='text-2xl font-bold   '>
            <span className='text-red-600'>{appfirstname}</span>
            <span className='text-gray-900'>{applastname}</span>
          </p>
        </div>
        <h2 className='text-center text-3xl font-bold tracking-tight text-slate-900'>
          Sign in to your account
        </h2>
      </div>

      {/* Login Card Form */}
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0'>
        <div className='bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200/80'>
          <form className='space-y-6' onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-slate-700 mb-1.5'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={Email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='name@example.com'
                  className='appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm'
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className='flex items-center justify-between mb-1.5'>
                <label
                  htmlFor='password'
                  className='block text-sm font-semibold text-slate-700'
                >
                  Password
                </label>
                {/* <div className='text-sm'>
                  <a className='font-medium text-red-600 hover:text-red-500 transition opacity-70'>
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={Password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className='appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm'
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className='h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded cursor-pointer'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-slate-600 cursor-pointer'
                >
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-red-600/25 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition active:scale-95'
              >
                {Loading ? 'Signing in' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
