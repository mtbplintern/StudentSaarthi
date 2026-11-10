 import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  LayoutDashboard,
  Sparkles,
  Share2,
  ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export default function PostedJob() {
   const navigate = useNavigate()
  const location = useLocation()

  const jobId = location.state?.jobId

  const shareJob = async () => {
    const jobUrl = window.location.origin + '/job-detail/' + jobId
    

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'New job update',
          text: 'Check out my newly posted job opportunity.',
          url: jobUrl
        })
      } else {
        await navigator.clipboard.writeText(jobUrl)
        toast.success('Job link copied successfully!')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Sharing failed:', error)
      }
    }
  }

  useEffect(() => {
    if (!jobId) {
      navigate("/my-jobs")
    }
  }, [])

  return (
    <div
      className='min-h-[94vh] w-full flex items-center justify-center
      bg-linear-to-br from-red-50 via-white to-rose-100
      px-3 py-6 sm:px-4 sm:py-10 relative overflow-hidden'
    >
      {/* Background Decorations */}
      <div
        className='absolute -top-24 -right-24 w-48 h-48 sm:w-72 sm:h-72
        bg-red-200/40 rounded-full blur-3xl'
      />

      <div
        className='absolute -bottom-24 -left-24 w-48 h-48 sm:w-72 sm:h-72
        bg-rose-200/50 rounded-full blur-3xl'
      />

      {/* Main Card */}
      <div
        className='relative w-full max-w-lg bg-white/90
        backdrop-blur-xl border border-white rounded-2xl sm:rounded-3xl
        shadow-[0_20px_70px_rgba(220,38,38,0.12)]
        px-4 py-7 sm:px-10 sm:py-12 text-center'
      >
        <p
          onClick={() => navigate("/my-jobs")}
          className='absolute top-4 left-4 inline-flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium mb-6 transition'
        >
          <ArrowLeft size={17} />
          Back
        </p>
        {/* Success Icon */}
        <div
          className='relative mx-auto mb-5 sm:mb-7
          w-20 h-20 sm:w-28 sm:h-28
          flex items-center justify-center'
        >
          <div
            className='absolute inset-0 bg-green-100
            rounded-full animate-pulse opacity-70'
          />

          <div
            className='relative w-16 h-16 sm:w-24 sm:h-24
            bg-linear-to-br from-green-400 to-emerald-600
            rounded-full flex items-center justify-center
            shadow-xl shadow-green-200'
          >
            <CheckCircle
              size={38}
              className='sm:hidden text-white'
              strokeWidth={2.5}
            />

            <CheckCircle
              size={54}
              className='hidden sm:block text-white'
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Small Label */}
        <div
          className='inline-flex items-center gap-1.5 sm:gap-2
          bg-green-50 text-green-700 px-3 py-1.5 sm:px-4 sm:py-2
          rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-5'
        >
          <Sparkles size={14} />
          Successfully Publishe
        </div>

        {/* Heading */}
        <h1
          className='text-2xl sm:text-4xl font-extrabold
          text-gray-900 tracking-tight leading-tight'
        >
          Job Posted
          <span className='block text-red-600 mt-1'>Successfully!</span>
        </h1>

        {/* Description */}
        <p
          className='text-gray-500 text-xs sm:text-base
          leading-6 sm:leading-7 mt-3 sm:mt-5 max-w-md mx-auto'
        >
          Your job details have been submitted successfully. Your opportunity is
          now ready to connect with talented candidates. Good luck finding the
          perfect match!
        </p>

        {/* Divider */}
        <div className='w-full h-px bg-gray-100 my-6 sm:my-8' />

        {/* Buttons */}
        <div className='flex flex-col gap-3 sm:gap-4'>
          {/* Post New Job */}
          <button
            onClick={shareJob}
            className='w-full flex items-center justify-center
              gap-2 bg-red-500 hover:bg-red-600
              text-white px-4 py-3 sm:py-4 rounded-xl
              font-bold text-sm sm:text-base
              shadow-lg shadow-red-200
              hover:shadow-red-300 hover:-translate-y-1
              transition-all duration-300 active:scale-95'
          >
            <Share2 size={19} />
            Share Job
          </button>
        </div>

        {/* Footer */}
        <div
          className='mt-6 sm:mt-9 flex items-center justify-center
          gap-2 text-[10px] sm:text-sm text-gray-400'
        >
          <LayoutDashboard size={14} />
          Manage your opportunities from your dashboard
        </div>
      </div>
    </div>
  )
}
