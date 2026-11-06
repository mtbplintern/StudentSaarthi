import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { appfirstname, applastname, backendurl } from '../config'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Navbar () {
  const navigate = useNavigate()
  const location = useLocation()

  const [Userdata, setUserdata] = useState({})
  const [Login, setLogin] = useState(false)
  const [MenuOpen, setMenuOpen] = useState(false)

  const recruiterRoutes = [
    '/add-jobs',
    '/my-jobs',
    '/job-posted',
    '/profile',
    '/edit-job'
  ]

  const recruiterpage = recruiterRoutes.some(route =>
    location.pathname.startsWith(route)
  )
 
  const GetUserdata = async () => {
    try {
      const request = await axios.get(`${backendurl}/auth/userdata`)

      if (request.data.success) {
        const requestuser = request.data.userdata

        setUserdata(requestuser)
        setLogin(true)

        if (recruiterpage && requestuser.role?.toLowerCase() !== 'recruiter') {
          toast.error('You are not a recruiter')
          navigate('/')
        }
      }
    } catch (error) {
      console.log(error)

      if (recruiterpage) {
        navigate('/')
      }
      setLogin(false)
    }
  }

  useEffect(() => {
    GetUserdata()
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { name: 'Home', path: '/' },

    ...(Userdata?.role?.toLowerCase() === 'recruiter'
      ? [
          { name: 'My Jobs', path: '/my-jobs' },
          { name: 'Post a Job', path: '/add-jobs' }
        ]
      : [])
  ]

  const isActive = path => location.pathname === path

  const handleNavigate = path => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <nav className='sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className=' py-1.5 flex items-center justify-between'>
          {/* Logo */}
          <div
            onClick={() => handleNavigate('/')}
            className='cursor-pointer select-none'
          >
            <h1 className='text-2xl font-extrabold tracking-tight'>
              <span className='text-red-600'>{appfirstname}</span>
              <span className='text-gray-900'>{applastname}</span>
            </h1>
            <p className='hidden sm:block text-[10px] tracking-[3px] text-gray-400 font-semibold uppercase'>
              Find your next opportunity
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-2'>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path)
                    ? '  text-red-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                }`}
              >
                {item.name}

                {isActive(item.path) && (
                  <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-red-600 rounded-full' />
                )}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-3'>
            {Login ? (
              <button
                onClick={() => handleNavigate('/profile')}
                className='flex items-center gap-2 sm:gap-3 border border-gray-200 hover:border-red-300 bg-white rounded-xl px-2 sm:px-3 py-1.5 transition'
              >
                <div className='w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg'>
                  {Userdata?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className='hidden sm:block text-left'>
                  <p className='text-sm font-bold text-gray-800 max-w-28 truncate'>
                    {Userdata?.name}
                  </p>
                  <p className='text-xs text-gray-400 capitalize'>
                    {Userdata?.role}
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('/login')}
                className='bg-red-600 hover:bg-red-700 active:scale-95 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-red-100 transition-all'
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!MenuOpen)}
              className='md:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition'
              aria-label='Toggle navigation menu'
              aria-expanded={MenuOpen}
            >
              {MenuOpen ? (
                <svg
                  className='w-6 h-6 text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='w-6 h-6 text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            MenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-1'>
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive(item.path)
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-600 hover:bg-white hover:text-red-600'
                }`}
              >
                {item.name}

                <span className='text-lg'>›</span>
              </button>
            ))}

            {Login && (
              <div className='border-t border-gray-200 mt-2 pt-3 px-4'>
                <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>
                  Logged in as
                </p>
                <p className='text-sm font-bold text-gray-800 mt-1'>
                  {Userdata?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
