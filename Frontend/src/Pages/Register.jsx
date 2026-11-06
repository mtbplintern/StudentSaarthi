import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { GiReturnArrow } from 'react-icons/gi'
import { backendurl } from '../config'
import { ArrowLeft } from 'lucide-react'

export default function Register () {
  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')
  const [Email, setEmail] = useState('')
  const [Phone, setPhone] = useState('')
  const [AgreeToTerms, setAgreeToTerms] = useState('')
  const [Loading, setLoading] = useState('')
  const [OTPvarify, setOTPvarify] = useState(false)
  const [OTP, setOTP] = useState('')
  const navigate = useNavigate()

  const handleSendOtp = async e => {
    e.preventDefault()
          
    if (Loading == "Sendingotp") return


    if (!Username.trim()) {
      return toast.error('Username is required')
    }

    if (Username.trim().length < 3) {
      return toast.error('Username must be at least 3 characters')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!Email.trim()) {
      return toast.error('Email is required')
    }

    if (!emailRegex.test(Email.trim())) {
      return toast.error('Please enter a valid email address')
    }

    if (!Phone.trim()) {
      return toast.error('Phone number is required')
    }

    if (Phone.length !== 10) {
      return toast.error('Enter a valid 10-digit Indian mobile number')
    }

    if (!Password) {
      return toast.error('Password is required')
    }

    if (Password.length < 3) {
      return toast.error('Password must be at least 3 characters')
    }

    if (!AgreeToTerms) {
      return toast.error('Please agree to the terms and conditions')
    }

    try {
      setLoading('Sendingotp')


      const request = await axios.post(`${backendurl}/auth/send-otp`, {
        Email
      })

      if (request.data.success) {
        toast.success('OTP send to your mail')

        setLoading('')
        setOTPvarify(true)
      }
    } catch (error) {
      console.log(error)

      toast.error(error?.response?.data?.message || 'Something went wrong')
      setLoading('')
    }
  }

  const Varifyotp = async () => {
    if (Loading == 'verifyotp') return

    if (!OTP) return toast.error('OTP messing')
    if (OTP.length != 6) return toast.error('invalid otp')
    if (!Email) return toast.error('Email messing')

    try {
      setLoading('verifyotp')

      const request = await axios.post(`${backendurl}/auth/verify-otp`, {
        Email,
        OTP
      })

      if (request.data.success) {
        RegisterUser()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
      setLoading('')
    }
  }

  const RegisterUser = async () => {
    if (Loading == "register") return

    if (!Username) return toast.error('Username messing')
    if (!Password) return toast.error('Password messing')
    if (!Email) return toast.error('Email messing')
    if (!Phone) return toast.error('Phone No. messing')

    if (Phone.length != 10) return toast.error('Phone number incorrect')

    if (!Email.includes('@gmail.com')) return toast.error('Email incorrect')

    try {
      setLoading("register")

      const request = await axios.post(`${backendurl}/auth/register`, {
        Email,
        Username,
        Password,
        Phone
      })

      if (request.data.success) {
        toast.success('Register success')
        setPassword('')
        setPhone('')
        setUsername('')

        navigate(`/`)

        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
      setLoading(false)
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
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center items-center gap-2 mb-3'>
          <div className='h-10 w-10 rounded-xl bg-linear-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-md shadow-red-500/20'>
            <GiReturnArrow className='w-6 h-6 text-white' />
          </div>
          <p className='text-2xl font-bold   '>
            <span className='text-red-600'>Job</span>
            <span className='text-gray-900'>Finder.</span>
          </p>
        </div>
        <h2 className='text-center text-3xl font-bold tracking-tight text-slate-900'>
          Create a new account
        </h2>
        <p className='mt-2 text-center text-sm text-slate-600'>
          Already have an account?{' '}
          <a
            onClick={() => navigate('/login')}
            className='font-medium text-red-600 hover:text-red-500 transition'
          >
            Sign in instead
          </a>
        </p>
      </div>

      {/* Register Card Form */}
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0'>
        <div className='bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200/80'>
          <form className='space-y-5' onSubmit={handleSendOtp}>
            {/* Full Name Field */}
            <div>
              <label
                htmlFor='fullName'
                className='block text-sm font-semibold text-slate-700 mb-1.5'
              >
                Full Name
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                autoComplete='name'
                value={Username}
                onChange={e => setUsername(e.target.value)}
                placeholder='John Doe'
                className='appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm'
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold text-slate-700 mb-1.5'
              >
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='text'
                autoComplete='email'
                value={Email}
                onChange={e => setEmail(e.target.value)}
                placeholder='name@example.com'
                className='appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm'
              />
            </div>

            {/* Phone  Field */}
            <div>
              <label
                htmlFor='phonenumber'
                className='block text-sm font-semibold text-slate-700 mb-1.5'
              >
                Phone Number
              </label>
              <input
                id='tel'
                name='tel'
                type='tel'
                autoComplete='tel'
                maxLength={10}
                value={Phone}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setPhone(value)
                }}
                placeholder='1234567890'
                className='appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm'
              />
            </div>
            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-semibold text-slate-700 mb-1.5'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                value={Password}
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••••'
                className='appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm'
              />
            </div>

            {/* Terms Agreement Checkbox */}
            <div className='flex items-center'>
              <input
                id='agreeToTerms'
                name='agreeToTerms'
                type='checkbox'
                checked={AgreeToTerms}
                onChange={e =>
                  setAgreeToTerms(prev => (prev == 'checked' ? '' : 'checked'))
                }
                className='h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded cursor-pointer'
              />
              <label
                htmlFor='agreeToTerms'
                className='ml-2 block text-sm text-slate-600 cursor-pointer'
              >
                I agree to the{' '}
                <a
                  href='#terms'
                  className='text-red-600 hover:underline font-medium'
                >
                  Terms
                </a>{' '}
                and{' '}
                <a
                  href='#privacy'
                  className='text-red-600 hover:underline font-medium'
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-red-600/25 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition active:scale-95'
              >
                {Loading == 'Sendingotp' ? ' Sending Otp ' : 'Create Account'}
                
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-slate-500'>
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className='mt-6 grid grid-cols-2 gap-3  opacity-60'>
              <button
                type='button'
                className='w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition'
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='#EA4335'
                    d='M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.8 7.4l3.7 2.9C6.4 7.3 9 5 12 5z'
                  />
                  <path
                    fill='#4285F4'
                    d='M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z'
                  />
                  <path
                    fill='#FBBC05'
                    d='M5.5 14.7c-.2-.8-.4-1.7-.4-2.7s.2-1.9.4-2.7L1.8 6.4C.7 8.6 0 11.2 0 14s.7 5.4 1.8 7.6l3.7-2.9z'
                  />
                  <path
                    fill='#34A853'
                    d='M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.6-2.3-6.5-5.3L1.8 15.9C3.7 19.7 7.5 23 12 23z'
                  />
                </svg>
                Google
              </button>

              <button
                type='button'
                className='w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition'
              >
                <svg className='w-5 h-5 mr-2 fill-current' viewBox='0 0 24 24'>
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      {OTPvarify && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4'>
          <div className='relative flex flex-col bg-slate-50 w-full max-w-sm gap-6 p-8 items-center border border-gray-200 rounded-3xl shadow-2xl'>
            {/* Close Button */}
            <button
              onClick={() => setOTPvarify(false)}
              className='absolute top-4 right-5 text-gray-400 hover:text-gray-700 font-bold text-xl cursor-pointer transition'
            >
              ✕
            </button>

            {/* Title */}
            <div className='text-center'>
              <h1 className='font-bold text-red-500 text-2xl'>
                OTP Verification
              </h1>
              <p className='text-gray-500 text-sm mt-1'>
                Enter the verification code sent to your phone
              </p>
            </div>

            {/* OTP Input */}
            <input
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setOTP(value)
              }}
              className='bg-white border-2 border-gray-200 focus:border-red-500 tracking-widest rounded-2xl h-14 w-full outline-none text-red-500 font-bold text-2xl text-center shadow-inner transition [&::-webkit-inner-spin-button]:appearance-none'
              type='number'
              placeholder='••••••'
              value={OTP}
            />

            {/* Verify Button */}
            <button
              onClick={() => Varifyotp()}
              className='w-full rounded-2xl px-5 bg-red-500 hover:bg-red-500 text-white py-3 cursor-pointer font-semibold shadow-lg shadow-[#555fff]/30 transition active:scale-[0.98]'
            >
              {Loading == 'verifyotp' ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
