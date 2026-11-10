import React from 'react'
import Navbar from '../Component/Navbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout () {
  return (
    <div className='rounded-[20px] w-full'>
      <Navbar />

      <Outlet />
    </div>
  )
}
