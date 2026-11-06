
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-50 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-50 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full text-center">

        {/* Logo / Brand */}
        <div className="mb-10">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600 text-white text-2xl font-bold shadow-lg shadow-red-200">
            !
          </span>
        </div>

        {/* 404 Number */}
        <h1 className="text-[120px] sm:text-[170px] md:text-[200px] leading-none font-black tracking-tighter text-red-600">
          404
        </h1>

        {/* Error Text */}
        <div className="mt-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>

          <p className="mt-4 text-gray-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            The page you're looking for might have been removed,
            had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5L12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6"
              />
            </svg>
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Error Code: <span className="text-red-500 font-semibold">404</span>
            {' '} | The page doesn't exist.
          </p>
        </div>

      </div>
    </div>
  )
}
