import React from 'react'

export default function Loading () {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-red-100 border-t-red-500 rounded-full animate-spin' />

        <p className='text-xl font-semibold text-gray-700 animate-pulse'>
          Loading...
        </p>
      </div>
    </div>
  )
}
