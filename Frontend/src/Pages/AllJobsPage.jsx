import axios from 'axios'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Eye,
  IndianRupee,
  MapPin,
  Users
} from 'lucide-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { backendurl } from '../config'
import toast from 'react-hot-toast'
  
import { useRef } from 'react'
import Jobpage from '../Component/Jobpage'

export default function AllJobsPage () {
   const isFirstRender = useRef(true)
  const loadMoreRef = useRef(null)

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchloading, setsearchLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('All Jobs')
  const [Jobs, setJobs] = useState([])

  const GetJobsDetail = async (pageNo = 1) => {
    try {
      setLoading(true)

      const request = await axios.get(
        `${backendurl}/data/jobdetail?limit=20&page=${pageNo}`
      )

      if (request.data.success) {
        const newJobs = request.data.jobs

        setJobs(prev => (pageNo === 1 ? newJobs : [...prev, ...newJobs]))

        setHasMore(newJobs.length === 20)
        setPage(pageNo)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const GetSerchJobDetail = async (pageNo = 1) => {
    try {
      setsearchLoading(true)
      const request = await axios.get(`${backendurl}/data/serch-jobsdetail`, {
        params: {
          limit: 20,
          page: pageNo,
          searchlocation: location.trim().toLowerCase(),
          searchtext: search.trim().toLowerCase()
        }
      })

      if (request.data.success) {
        const newJobs = request.data.jobs

        setJobs(newJobs)

        setHasMore(newJobs.length === 20)
        setPage(pageNo)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setsearchLoading(false)
    }
  }

  useEffect(() => {
    GetJobsDetail(1)
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      GetSerchJobDetail(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [search, location])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          GetJobsDetail(page + 1)
        }
      },
      {
        threshold: 0.5
      }
    )

    const currentElement = loadMoreRef.current

    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
      observer.disconnect()
    }
  }, [hasMore, loading, page])

  return (
    <div className='sm:max-w-[95%] min-h-screen mx-auto px-2 sm:px-6 bg-gray-50 py-6  '>
      <div className='bg-white border border-gray-100 rounded-xl p-5 sm:p-7 mb-6 shadow-sm'>
        {/* Heading */}
        <div className='mb-5'>
          <p className='text-red-600 font-bold text-xs sm:text-sm tracking-wider'>
            FEATURED JOBS
          </p>

          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mt-1'>
            Find Your <span className='text-red-600'>Dream Job</span>
          </h2>

          <p className='text-gray-500 text-sm mt-2'>
            Explore the latest job opportunities and find the right career for
            you.
          </p>
        </div>

        {/* Search Filters */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_auto] gap-3'>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
              <i className='fas fa-search'></i>
            </span>
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Job title, skills or company...'
              className='w-full border border-gray-400 rounded-lg pl-3 sm:pl-10 pr-3 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100'
            />
          </div>

          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
              <i className='fas fa-map-marker-alt'></i>
            </span>
            <input
              type='text'
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder='City or location'
              className='w-full border border-gray-400 rounded-lg pl-3 sm:pl-10 pr-3 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100'
            />
          </div>

          <button
            onClick={() => {
              GetSerchJob()
            }}
            className='bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-7 py-3 text-sm transition'
          >
            <i className='fas fa-search mr-2'></i>
            {searchloading ? 'Searching' : 'Search Jobs'}
          </button>
        </div>

        {/* Job Type Filters */}
        <div className='hidden sm:flex flex-wrap items-center gap-2 mt-4'>
          <span className='text-sm text-gray-500 font-medium mr-1'>
            Job Type:
          </span>

          {[
            'All Jobs',
            'work from home',
            'Contract',
            'Remote',
            'Permanent'
          ].map(type => (
            <button
              key={type}
              onClick={() => (
                setJobType(type),
                type == 'All Jobs' ? setSearch('') : setSearch(type)
              )}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition ${
                jobType === type
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-500 hover:text-red-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className='flex flex-col justify-center items-center gap-4 sm:gap-5'>
        {Jobs.length > 0 &&
          Jobs.map((job, i) => (
            <div
              className='w-full flex flex-col items-center justify-center gap-3'
              key={i}
            >
              <Jobpage finaljobdata={job} jobKey={i + 1} />
              <div className='border rounded-2xl border-gray-300  w-[90%] md:w-[80%] lg:w-[220mm] '></div>
            </div>
          ))}
      </div>

     
      {!loading && Jobs.length === 0 && (
        <div
          className='bg-white rounded-xl sm:rounded-2xl border
      border-gray-100 p-6 sm:p-16 text-center'
        >
          <div
            className='w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-50
        text-red-500 flex items-center justify-center mx-auto mb-4'
          >
            <BriefcaseBusiness size={28} />
          </div>

          <h3 className='text-lg sm:text-xl font-bold text-gray-900'>
            No Jobs Found
          </h3>

          <p className='text-gray-500 text-sm mt-2'>
            No jobs match your search. Try another keyword .
          </p>
        </div>
      )}
      {hasMore &&  (
        <div  ref={loadMoreRef}
          className='bg-white rounded-xl sm:rounded-2xl border
      border-gray-100 p-6 sm:p-16 text-center'
        >
          <div
            className='w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-50
        text-red-500 flex items-center justify-center mx-auto mb-4'
          >
            <BriefcaseBusiness size={28} />
          </div>

          <h3 className='text-lg sm:text-xl font-bold text-gray-900'>
          {loading ? 'Loading job...' : 'Scroll to load more jobs'}
          </h3>

          
        </div>
      )}
    </div>
  )
}
